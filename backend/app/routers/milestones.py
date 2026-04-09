from __future__ import annotations

from uuid import UUID
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models.user import User
from app.models.contract import Contract
from app.models.milestone import Milestone, MilestoneStatus
from app.models.deliverable import Deliverable
from app.schemas.milestone import MilestoneCreate, MilestoneUpdate, MilestoneOut
from app.middleware.auth import get_current_user

router = APIRouter()


async def _get_milestone_with_contract(milestone_id: UUID, db: AsyncSession) -> tuple[Milestone, Contract]:
    result = await db.execute(
        select(Milestone).options(selectinload(Milestone.contract)).where(Milestone.id == milestone_id)
    )
    milestone = result.scalar_one_or_none()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found")
    return milestone, milestone.contract


@router.post("/{contract_id}", response_model=MilestoneOut, status_code=201)
async def add_milestone(
    contract_id: UUID,
    data: MilestoneCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Contract).where(Contract.id == contract_id))
    contract = result.scalar_one_or_none()
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    if contract.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the client can add milestones")

    milestone = Milestone(
        contract_id=contract_id,
        title=data.title,
        description=data.description,
        amount=data.amount,
        due_date=data.due_date,
        position=data.position,
    )
    db.add(milestone)
    await db.flush()
    await db.refresh(milestone)
    return MilestoneOut.model_validate(milestone)


@router.patch("/{milestone_id}", response_model=MilestoneOut)
async def update_milestone(
    milestone_id: UUID,
    data: MilestoneUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    milestone, contract = await _get_milestone_with_contract(milestone_id, db)
    if contract.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the client can update milestones")
    if milestone.status not in (MilestoneStatus.PENDING,):
        raise HTTPException(status_code=400, detail="Cannot update a milestone that is already funded or in progress")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(milestone, field, value)
    await db.flush()
    await db.refresh(milestone)
    return MilestoneOut.model_validate(milestone)


@router.post("/{milestone_id}/submit", response_model=MilestoneOut)
async def submit_milestone(
    milestone_id: UUID,
    description: str = "",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    milestone, contract = await _get_milestone_with_contract(milestone_id, db)
    if contract.freelancer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the freelancer can submit deliverables")
    if milestone.status not in (MilestoneStatus.FUNDED, MilestoneStatus.IN_PROGRESS):
        raise HTTPException(status_code=400, detail="Milestone must be funded before submission")

    deliverable = Deliverable(
        milestone_id=milestone_id,
        submitted_by=current_user.id,
        description=description,
    )
    db.add(deliverable)

    now = datetime.now(timezone.utc)
    milestone.status = MilestoneStatus.SUBMITTED
    milestone.submitted_at = now
    milestone.auto_release_at = now + timedelta(days=contract.auto_release_days)
    await db.flush()
    await db.refresh(milestone)
    return MilestoneOut.model_validate(milestone)


@router.post("/{milestone_id}/approve", response_model=MilestoneOut)
async def approve_milestone(
    milestone_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    milestone, contract = await _get_milestone_with_contract(milestone_id, db)
    if contract.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the client can approve milestones")
    if milestone.status != MilestoneStatus.SUBMITTED:
        raise HTTPException(status_code=400, detail="Milestone must be submitted before approval")

    milestone.status = MilestoneStatus.APPROVED
    milestone.approved_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(milestone)
    return MilestoneOut.model_validate(milestone)
