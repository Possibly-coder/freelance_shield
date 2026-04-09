from __future__ import annotations

from uuid import UUID
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models.user import User
from app.models.contract import Contract, ContractStatus
from app.models.milestone import Milestone, MilestoneStatus
from app.models.dispute import Dispute, DisputeStatus
from app.models.payment import Payment, PaymentType, PaymentStatus
from app.schemas.dispute import DisputeCreate, DisputeResolve, DisputeOut
from app.services.payment_service import create_refund, create_transfer
from app.middleware.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=DisputeOut, status_code=201)
async def raise_dispute(
    data: DisputeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Contract).where(Contract.id == data.contract_id))
    contract = result.scalar_one_or_none()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    if current_user.id not in (contract.client_id, contract.freelancer_id):
        raise HTTPException(status_code=403, detail="Not a party to this contract")

    if data.milestone_id:
        ms_result = await db.execute(select(Milestone).where(Milestone.id == data.milestone_id))
        milestone = ms_result.scalar_one_or_none()
        if not milestone:
            raise HTTPException(status_code=404, detail="Milestone not found")
        milestone.status = MilestoneStatus.DISPUTED

    contract.status = ContractStatus.DISPUTED

    dispute = Dispute(
        contract_id=data.contract_id,
        milestone_id=data.milestone_id,
        raised_by=current_user.id,
        reason=data.reason,
    )
    db.add(dispute)
    await db.flush()
    await db.refresh(dispute)
    return DisputeOut.model_validate(dispute)


@router.get("/contract/{contract_id}", response_model=list[DisputeOut])
async def list_disputes(
    contract_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Dispute).where(Dispute.contract_id == contract_id).order_by(Dispute.created_at.desc())
    )
    return [DisputeOut.model_validate(d) for d in result.scalars().all()]


@router.post("/{dispute_id}/resolve", response_model=DisputeOut)
async def resolve_dispute(
    dispute_id: UUID,
    data: DisputeResolve,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Resolve a dispute. For MVP, only the client can resolve.
    winner = "client" -> refund escrowed funds to client.
    winner = "freelancer" -> release funds to freelancer.
    """
    result = await db.execute(
        select(Dispute).options(selectinload(Dispute.contract)).where(Dispute.id == dispute_id)
    )
    dispute = result.scalar_one_or_none()
    if not dispute:
        raise HTTPException(status_code=404, detail="Dispute not found")

    contract = dispute.contract
    if contract.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the client can resolve disputes in MVP")
    if dispute.status not in (DisputeStatus.OPEN, DisputeStatus.UNDER_REVIEW):
        raise HTTPException(status_code=400, detail="Dispute already resolved")

    if dispute.milestone_id:
        ms_result = await db.execute(select(Milestone).where(Milestone.id == dispute.milestone_id))
        milestone = ms_result.scalar_one_or_none()

        escrow_result = await db.execute(
            select(Payment).where(
                Payment.milestone_id == dispute.milestone_id,
                Payment.type == PaymentType.ESCROW_IN,
                Payment.status == PaymentStatus.CAPTURED,
            )
        )
        escrow_payment = escrow_result.scalar_one_or_none()

        if data.winner == "client" and escrow_payment and escrow_payment.razorpay_payment_id:
            try:
                create_refund(escrow_payment.razorpay_payment_id, int(float(escrow_payment.amount) * 100))
                escrow_payment.status = PaymentStatus.REFUNDED
            except Exception:
                pass
            if milestone:
                milestone.status = MilestoneStatus.PENDING

        elif data.winner == "freelancer":
            if milestone:
                milestone.status = MilestoneStatus.APPROVED
                milestone.approved_at = datetime.now(timezone.utc)

    if data.winner == "client":
        dispute.status = DisputeStatus.RESOLVED_CLIENT
    elif data.winner == "freelancer":
        dispute.status = DisputeStatus.RESOLVED_FREELANCER
    else:
        dispute.status = DisputeStatus.RESOLVED

    dispute.resolution = data.resolution
    dispute.resolved_at = datetime.now(timezone.utc)

    open_disputes = await db.execute(
        select(Dispute).where(
            Dispute.contract_id == contract.id,
            Dispute.status.in_([DisputeStatus.OPEN, DisputeStatus.UNDER_REVIEW]),
            Dispute.id != dispute_id,
        )
    )
    if not open_disputes.scalars().first():
        contract.status = ContractStatus.ACTIVE

    await db.flush()
    await db.refresh(dispute)
    return DisputeOut.model_validate(dispute)
