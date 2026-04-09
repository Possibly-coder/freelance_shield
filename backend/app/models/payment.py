import uuid
from typing import Optional
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Numeric, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
import enum


class PaymentType(str, enum.Enum):
    ESCROW_IN = "escrow_in"
    RELEASE = "release"
    REFUND = "refund"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    CAPTURED = "captured"
    TRANSFERRED = "transferred"
    REFUNDED = "refunded"
    FAILED = "failed"


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    milestone_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("milestones.id"), nullable=False)
    payer_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    payee_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="INR")
    type: Mapped[PaymentType] = mapped_column(SAEnum(PaymentType), nullable=False)
    status: Mapped[PaymentStatus] = mapped_column(SAEnum(PaymentStatus), default=PaymentStatus.PENDING)
    razorpay_payment_id: Mapped[Optional[str]] = mapped_column(String(100))
    razorpay_order_id: Mapped[Optional[str]] = mapped_column(String(100))
    razorpay_transfer_id: Mapped[Optional[str]] = mapped_column(String(100))
    idempotency_key: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    milestone = relationship("Milestone", back_populates="payments")
    payer = relationship("User", foreign_keys=[payer_id])
    payee = relationship("User", foreign_keys=[payee_id])
