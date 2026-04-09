import uuid
from typing import Optional
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Numeric, ForeignKey, Text, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
import enum


class ProposalStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


class Proposal(Base):
    __tablename__ = "proposals"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    freelancer_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    cover_letter: Mapped[str] = mapped_column(Text, nullable=False)
    proposed_amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    estimated_duration: Mapped[Optional[str]] = mapped_column(String(100))
    status: Mapped[ProposalStatus] = mapped_column(SAEnum(ProposalStatus), default=ProposalStatus.PENDING)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="proposals")
    freelancer = relationship("User", foreign_keys=[freelancer_id])
