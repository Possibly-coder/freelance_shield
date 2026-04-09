from __future__ import annotations

from typing import Optional, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models.user import User
from app.models.project import Project, ProjectStatus
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectOut, ProjectListOut
from app.middleware.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=ProjectOut, status_code=201)
async def create_project(
    data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = Project(
        client_id=current_user.id,
        title=data.title,
        description=data.description,
        skills=data.skills or [],
        budget_min=data.budget_min,
        budget_max=data.budget_max,
        currency=data.currency,
        duration=data.duration,
    )
    db.add(project)
    await db.flush()

    result = await db.execute(
        select(Project).options(selectinload(Project.client)).where(Project.id == project.id)
    )
    return ProjectOut.model_validate(result.scalar_one())


@router.get("/", response_model=List[ProjectListOut])
async def browse_projects(
    skill: Optional[str] = Query(None, description="Filter by skill"),
    budget_min: Optional[float] = Query(None),
    budget_max: Optional[float] = Query(None),
    duration: Optional[str] = Query(None),
    search: Optional[str] = Query(None, description="Search title/description"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Project)
        .options(selectinload(Project.client))
        .where(Project.status == ProjectStatus.OPEN)
    )

    if skill:
        query = query.where(Project.skills.any(skill))
    if budget_min is not None:
        query = query.where(Project.budget_max >= budget_min)
    if budget_max is not None:
        query = query.where(Project.budget_min <= budget_max)
    if duration:
        query = query.where(Project.duration == duration)
    if search:
        pattern = f"%{search}%"
        query = query.where(
            or_(Project.title.ilike(pattern), Project.description.ilike(pattern))
        )

    query = query.order_by(Project.created_at.desc()).offset((page - 1) * limit).limit(limit)
    result = await db.execute(query)
    return [ProjectListOut.model_validate(p) for p in result.scalars().all()]


@router.get("/my", response_model=List[ProjectListOut])
async def my_projects(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Project)
        .options(selectinload(Project.client))
        .where(Project.client_id == current_user.id)
        .order_by(Project.created_at.desc())
    )
    return [ProjectListOut.model_validate(p) for p in result.scalars().all()]


@router.get("/{project_id}", response_model=ProjectOut)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Project).options(selectinload(Project.client)).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectOut.model_validate(project)


@router.patch("/{project_id}", response_model=ProjectOut)
async def update_project(
    project_id: UUID,
    data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Project).options(selectinload(Project.client)).where(Project.id == project_id)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the project owner can update")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(project, field, value)

    await db.flush()
    await db.refresh(project)
    return ProjectOut.model_validate(project)
