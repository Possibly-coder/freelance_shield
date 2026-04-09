from __future__ import annotations

from datetime import datetime, timezone
from fastapi import APIRouter, Header, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.database import async_session
from app.config import get_settings
from app.models.milestone import Milestone, MilestoneStatus
from app.models.payment import Payment, PaymentType, PaymentStatus
from app.models.contract import Contract
from app.models.user import User
from app.services.payment_service import create_transfer, generate_idempotency_key

settings = get_settings()
router = APIRouter()


@router.post("/auto-release")
async def process_auto_releases(x_cron_secret: str = Header(default="")):
    """
    Called by a cron job (e.g. every hour). Finds milestones past their
    auto_release_at deadline that are still in 'submitted' status and
    auto-approves + releases funds to the freelancer.
    """
    if x_cron_secret != settings.SECRET_KEY:
        raise HTTPException(status_code=403, detail="Invalid cron secret")

    now = datetime.now(timezone.utc)
    released = []

    async with async_session() as db:
        try:
            result = await db.execute(
                select(Milestone)
                .options(selectinload(Milestone.contract))
                .where(
                    Milestone.status == MilestoneStatus.SUBMITTED,
                    Milestone.auto_release_at <= now,
                    Milestone.auto_release_at.isnot(None),
                )
            )
            overdue_milestones = result.scalars().all()

            for milestone in overdue_milestones:
                contract = milestone.contract

                milestone.status = MilestoneStatus.APPROVED
                milestone.approved_at = now

                escrow_result = await db.execute(
                    select(Payment).where(
                        Payment.milestone_id == milestone.id,
                        Payment.type == PaymentType.ESCROW_IN,
                        Payment.status == PaymentStatus.CAPTURED,
                    )
                )
                escrow_payment = escrow_result.scalar_one_or_none()

                if escrow_payment:
                    freelancer_result = await db.execute(
                        select(User).where(User.id == contract.freelancer_id)
                    )
                    freelancer = freelancer_result.scalar_one_or_none()

                    amount_paise = int(float(milestone.amount) * 100)
                    transfer_data = None

                    if freelancer and freelancer.razorpay_fund_account_id and escrow_payment.razorpay_payment_id:
                        try:
                            transfer_data = create_transfer(
                                payment_id=escrow_payment.razorpay_payment_id,
                                amount_paise=amount_paise,
                                account_id=freelancer.razorpay_fund_account_id,
                                notes={"milestone_id": str(milestone.id), "auto_released": "true"},
                            )
                        except Exception:
                            pass

                    release_payment = Payment(
                        milestone_id=milestone.id,
                        payer_id=contract.client_id,
                        payee_id=contract.freelancer_id,
                        amount=milestone.amount,
                        currency=contract.currency,
                        type=PaymentType.RELEASE,
                        status=PaymentStatus.TRANSFERRED,
                        razorpay_payment_id=escrow_payment.razorpay_payment_id,
                        razorpay_transfer_id=transfer_data["items"][0]["id"] if transfer_data else None,
                        idempotency_key=generate_idempotency_key(milestone.id, "auto_release"),
                    )
                    db.add(release_payment)

                released.append({
                    "milestone_id": str(milestone.id),
                    "contract_title": contract.title,
                    "amount": float(milestone.amount),
                })

            await db.commit()
        except Exception:
            await db.rollback()
            raise

    return {
        "processed": len(released),
        "released": released,
    }
