import uuid
from typing import Optional, List
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Numeric, ForeignKey, Text, Integer, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
import enum


class ProjectStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    CLOSED = "closed"
    CANCELLED = "cancelled"


class ProjectDuration(str, enum.Enum):
    LESS_THAN_1_WEEK = "less_than_1_week"
    ONE_TO_2_WEEKS = "1_to_2_weeks"
    TWO_TO_4_WEEKS = "2_to_4_weeks"
    ONE_TO_3_MONTHS = "1_to_3_months"
    THREE_PLUS_MONTHS = "3_plus_months"


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    skills: Mapped[Optional[list]] = mapped_column(ARRAY(String(50)))
    budget_min: Mapped[Optional[float]] = mapped_column(Numeric(12, 2))
    budget_max: Mapped[Optional[float]] = mapped_column(Numeric(12, 2))
    currency: Mapped[str] = mapped_column(String(3), default="INR")
    duration: Mapped[Optional[ProjectDuration]] = mapped_column(SAEnum(ProjectDuration))
    status: Mapped[ProjectStatus] = mapped_column(SAEnum(ProjectStatus), default=ProjectStatus.OPEN)
    proposal_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    client = relationship("User", foreign_keys=[client_id])
    proposals = relationship("Proposal", back_populates="project", cascade="all, delete-orphan")
