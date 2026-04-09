import uuid
from typing import Optional
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, ForeignKey, Text, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
import enum


class DisputeStatus(str, enum.Enum):
    OPEN = "open"
    UNDER_REVIEW = "under_review"
    RESOLVED_CLIENT = "resolved_client"
    RESOLVED_FREELANCER = "resolved_freelancer"
    RESOLVED = "resolved"


class Dispute(Base):
    __tablename__ = "disputes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contract_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("contracts.id"), nullable=False)
    milestone_id: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("milestones.id"))
    raised_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[DisputeStatus] = mapped_column(SAEnum(DisputeStatus), default=DisputeStatus.OPEN)
    resolution: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    contract = relationship("Contract", back_populates="disputes")
    milestone = relationship("Milestone", back_populates="disputes")
    raiser = relationship("User", foreign_keys=[raised_by])
