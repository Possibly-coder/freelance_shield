from typing import Optional
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from app.models.payment import PaymentType, PaymentStatus


class PaymentCreate(BaseModel):
    milestone_id: UUID


class PaymentVerify(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str


class PaymentOut(BaseModel):
    id: UUID
    milestone_id: UUID
    payer_id: UUID
    payee_id: Optional[UUID] = None
    amount: float
    currency: str
    type: PaymentType
    status: PaymentStatus
    razorpay_payment_id: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class RazorpayOrderOut(BaseModel):
    order_id: str
    amount: int
    currency: str
    payment_id: UUID
