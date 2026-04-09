import uuid
from typing import Optional
from datetime import datetime, timezone, date
from sqlalchemy import String, DateTime, Numeric, ForeignKey, Text, Integer, Date, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
import enum


class MilestoneStatus(str, enum.Enum):
    PENDING = "pending"
    FUNDED = "funded"
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    DISPUTED = "disputed"


class Milestone(Base):
    __tablename__ = "milestones"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contract_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("contracts.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    due_date: Mapped[Optional[date]] = mapped_column(Date)
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    status: Mapped[MilestoneStatus] = mapped_column(SAEnum(MilestoneStatus), default=MilestoneStatus.PENDING)
    funded_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    submitted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    approved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    auto_release_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    contract = relationship("Contract", back_populates="milestones")
    payments = relationship("Payment", back_populates="milestone")
    deliverables = relationship("Deliverable", back_populates="milestone")
    disputes = relationship("Dispute", back_populates="milestone")
