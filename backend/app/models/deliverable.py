import uuid
from typing import Optional
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Deliverable(Base):
    __tablename__ = "deliverables"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    milestone_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("milestones.id"), nullable=False)
    submitted_by: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    file_url: Mapped[Optional[str]] = mapped_column(String(512))
    description: Mapped[Optional[str]] = mapped_column(Text)
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    milestone = relationship("Milestone", back_populates="deliverables")
    submitter = relationship("User", foreign_keys=[submitted_by])
