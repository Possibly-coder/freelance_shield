from __future__ import annotations

from uuid import UUID
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models.user import User
from app.models.milestone import Milestone, MilestoneStatus
from app.models.payment import Payment, PaymentType, PaymentStatus
from app.schemas.payment import PaymentCreate, PaymentVerify, PaymentOut, RazorpayOrderOut
from app.services.payment_service import (
    create_razorpay_order,
    verify_payment_signature,
    create_transfer,
    generate_idempotency_key,
)
from app.middleware.auth import get_current_user

router = APIRouter()


@router.post("/fund-demo")
async def fund_milestone_demo(
    data: PaymentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Demo fund -- skips Razorpay, directly marks milestone as funded."""
    result = await db.execute(
        select(Milestone).options(selectinload(Milestone.contract)).where(Milestone.id == data.milestone_id)
    )
    milestone = result.scalar_one_or_none()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    if milestone.contract.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the client can fund milestones")
    if milestone.status != MilestoneStatus.PENDING:
        raise HTTPException(status_code=400, detail="Milestone is already funded")

    milestone.status = MilestoneStatus.FUNDED
    milestone.funded_at = datetime.now(timezone.utc)

    idempotency_key = generate_idempotency_key(milestone.id, PaymentType.ESCROW_IN)
    payment = Payment(
        milestone_id=milestone.id,
        payer_id=current_user.id,
        payee_id=milestone.contract.freelancer_id,
        amount=milestone.amount,
        currency=milestone.contract.currency,
        type=PaymentType.ESCROW_IN,
        status=PaymentStatus.CAPTURED,
        idempotency_key=idempotency_key,
    )
    db.add(payment)
    await db.flush()
    return {"status": "funded", "milestone_id": str(milestone.id)}


@router.post("/fund", response_model=RazorpayOrderOut)
async def fund_milestone(
    data: PaymentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Client funds a milestone -- creates a Razorpay order for payment."""
    result = await db.execute(
        select(Milestone).options(selectinload(Milestone.contract)).where(Milestone.id == data.milestone_id)
    )
    milestone = result.scalar_one_or_none()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    if milestone.contract.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the client can fund milestones")
    if milestone.status != MilestoneStatus.PENDING:
        raise HTTPException(status_code=400, detail="Milestone is already funded")

    amount_paise = int(float(milestone.amount) * 100)
    idempotency_key = generate_idempotency_key(milestone.id, PaymentType.ESCROW_IN)

    order = create_razorpay_order(
        amount_paise=amount_paise,
        currency=milestone.contract.currency,
        receipt=str(milestone.id),
        notes={"milestone_id": str(milestone.id), "contract_id": str(milestone.contract_id)},
    )

    payment = Payment(
        milestone_id=milestone.id,
        payer_id=current_user.id,
        payee_id=milestone.contract.freelancer_id,
        amount=milestone.amount,
        currency=milestone.contract.currency,
        type=PaymentType.ESCROW_IN,
        status=PaymentStatus.PENDING,
        razorpay_order_id=order["id"],
        idempotency_key=idempotency_key,
    )
    db.add(payment)
    await db.flush()
    await db.refresh(payment)

    return RazorpayOrderOut(
        order_id=order["id"],
        amount=amount_paise,
        currency=milestone.contract.currency,
        payment_id=payment.id,
    )


@router.post("/verify", response_model=PaymentOut)
async def verify_payment(
    data: PaymentVerify,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Verify a Razorpay payment after client completes checkout."""
    result = await db.execute(
        select(Payment)
        .options(selectinload(Payment.milestone))
        .where(Payment.razorpay_order_id == data.razorpay_order_id)
    )
    payment = result.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")

    if not verify_payment_signature(data.razorpay_order_id, data.razorpay_payment_id, data.razorpay_signature):
        payment.status = PaymentStatus.FAILED
        await db.flush()
        raise HTTPException(status_code=400, detail="Payment signature verification failed")

    payment.razorpay_payment_id = data.razorpay_payment_id
    payment.status = PaymentStatus.CAPTURED

    milestone = payment.milestone
    milestone.status = MilestoneStatus.FUNDED
    milestone.funded_at = datetime.now(timezone.utc)

    await db.flush()
    await db.refresh(payment)
    return PaymentOut.model_validate(payment)


@router.post("/release/{milestone_id}", response_model=PaymentOut)
async def release_payment(
    milestone_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Release escrowed funds to freelancer after milestone approval."""
    result = await db.execute(
        select(Milestone).options(selectinload(Milestone.contract)).where(Milestone.id == milestone_id)
    )
    milestone = result.scalar_one_or_none()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    if milestone.contract.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the client can release payments")
    if milestone.status != MilestoneStatus.APPROVED:
        raise HTTPException(status_code=400, detail="Milestone must be approved before releasing payment")

    escrow_result = await db.execute(
        select(Payment).where(
            Payment.milestone_id == milestone_id,
            Payment.type == PaymentType.ESCROW_IN,
            Payment.status == PaymentStatus.CAPTURED,
        )
    )
    escrow_payment = escrow_result.scalar_one_or_none()
    if not escrow_payment:
        raise HTTPException(status_code=400, detail="No captured escrow payment found")

    freelancer_result = await db.execute(
        select(User).where(User.id == milestone.contract.freelancer_id)
    )
    freelancer = freelancer_result.scalar_one_or_none()

    amount_paise = int(float(milestone.amount) * 100)
    idempotency_key = generate_idempotency_key(milestone.id, PaymentType.RELEASE)

    transfer_data = None
    if freelancer and freelancer.razorpay_fund_account_id and escrow_payment.razorpay_payment_id:
        try:
            transfer_data = create_transfer(
                payment_id=escrow_payment.razorpay_payment_id,
                amount_paise=amount_paise,
                account_id=freelancer.razorpay_fund_account_id,
                notes={"milestone_id": str(milestone_id)},
            )
        except Exception:
            pass

    release_payment_record = Payment(
        milestone_id=milestone_id,
        payer_id=current_user.id,
        payee_id=milestone.contract.freelancer_id,
        amount=milestone.amount,
        currency=milestone.contract.currency,
        type=PaymentType.RELEASE,
        status=PaymentStatus.TRANSFERRED,
        razorpay_payment_id=escrow_payment.razorpay_payment_id,
        razorpay_transfer_id=transfer_data["items"][0]["id"] if transfer_data else None,
        idempotency_key=idempotency_key,
    )
    db.add(release_payment_record)
    await db.flush()
    await db.refresh(release_payment_record)
    return PaymentOut.model_validate(release_payment_record)


@router.get("/contract/{contract_id}", response_model=list[PaymentOut])
async def list_payments(
    contract_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Payment)
        .join(Milestone)
        .where(Milestone.contract_id == contract_id)
        .order_by(Payment.created_at.desc())
    )
    return [PaymentOut.model_validate(p) for p in result.scalars().all()]
