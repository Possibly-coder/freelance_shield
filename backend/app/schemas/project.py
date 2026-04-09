from typing import Optional, List
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from app.models.project import ProjectStatus, ProjectDuration
from app.schemas.user import UserOut


class ProjectCreate(BaseModel):
    title: str
    description: str
    skills: List[str] = []
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    currency: str = "INR"
    duration: Optional[ProjectDuration] = None


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    skills: Optional[List[str]] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    duration: Optional[ProjectDuration] = None
    status: Optional[ProjectStatus] = None


class ProjectOut(BaseModel):
    id: UUID
    client_id: UUID
    title: str
    description: str
    skills: Optional[List[str]] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    currency: str
    duration: Optional[ProjectDuration] = None
    status: ProjectStatus
    proposal_count: int
    created_at: datetime
    client: Optional[UserOut] = None

    model_config = {"from_attributes": True}


class ProjectListOut(BaseModel):
    id: UUID
    title: str
    skills: Optional[List[str]] = None
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    currency: str
    duration: Optional[ProjectDuration] = None
    status: ProjectStatus
    proposal_count: int
    created_at: datetime
    client: Optional[UserOut] = None

    model_config = {"from_attributes": True}
