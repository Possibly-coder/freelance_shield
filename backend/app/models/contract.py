import uuid
import secrets
from typing import Optional
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Numeric, ForeignKey, Text, Integer, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
import enum


class ContractStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    COMPLETED = "completed"
    DISPUTED = "disputed"
    CANCELLED = "cancelled"


class Contract(Base):
    __tablename__ = "contracts"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    client_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    freelancer_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    status: Mapped[ContractStatus] = mapped_column(SAEnum(ContractStatus), default=ContractStatus.DRAFT)
    total_amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="INR")
    auto_release_days: Mapped[int] = mapped_column(Integer, default=7)
    invite_token: Mapped[str] = mapped_column(String(64), unique=True, default=lambda: secrets.token_urlsafe(32))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    signed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    client = relationship("User", back_populates="client_contracts", foreign_keys=[client_id])
    freelancer = relationship("User", back_populates="freelancer_contracts", foreign_keys=[freelancer_id])
    milestones = relationship("Milestone", back_populates="contract", cascade="all, delete-orphan", order_by="Milestone.position")
    disputes = relationship("Dispute", back_populates="contract")
