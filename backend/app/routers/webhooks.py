from __future__ import annotations

from fastapi import APIRouter, Request, HTTPException
from sqlalchemy import select
from app.database import async_session
from app.models.payment import Payment, PaymentStatus
from app.models.milestone import Milestone, MilestoneStatus
from app.services.payment_service import verify_webhook_signature

router = APIRouter()


@router.post("/razorpay")
async def razorpay_webhook(request: Request):
    """Handle Razorpay webhook events -- the source of truth for payment status."""
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")

    if not verify_webhook_signature(body, signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    payload = await request.json()
    event = payload.get("event", "")

    async with async_session() as db:
        try:
            if event == "payment.captured":
                payment_entity = payload["payload"]["payment"]["entity"]
                rzp_order_id = payment_entity.get("order_id")
                rzp_payment_id = payment_entity.get("id")

                result = await db.execute(
                    select(Payment).where(Payment.razorpay_order_id == rzp_order_id)
                )
                payment = result.scalar_one_or_none()
                if payment and payment.status == PaymentStatus.PENDING:
                    payment.razorpay_payment_id = rzp_payment_id
                    payment.status = PaymentStatus.CAPTURED

                    ms_result = await db.execute(
                        select(Milestone).where(Milestone.id == payment.milestone_id)
                    )
                    milestone = ms_result.scalar_one_or_none()
                    if milestone:
                        milestone.status = MilestoneStatus.FUNDED

                    await db.commit()

            elif event == "payment.failed":
                payment_entity = payload["payload"]["payment"]["entity"]
                rzp_order_id = payment_entity.get("order_id")

                result = await db.execute(
                    select(Payment).where(Payment.razorpay_order_id == rzp_order_id)
                )
                payment = result.scalar_one_or_none()
                if payment and payment.status == PaymentStatus.PENDING:
                    payment.status = PaymentStatus.FAILED
                    await db.commit()

            elif event == "transfer.processed":
                transfer_entity = payload["payload"]["transfer"]["entity"]
                rzp_transfer_id = transfer_entity.get("id")

                result = await db.execute(
                    select(Payment).where(Payment.razorpay_transfer_id == rzp_transfer_id)
                )
                payment = result.scalar_one_or_none()
                if payment:
                    payment.status = PaymentStatus.TRANSFERRED
                    await db.commit()

        except Exception:
            await db.rollback()
            raise

    return {"status": "ok"}
