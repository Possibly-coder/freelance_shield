from __future__ import annotations

from typing import List
from uuid import UUID
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.database import get_db
from app.models.user import User
from app.models.project import Project, ProjectStatus
from app.models.proposal import Proposal, ProposalStatus
from app.models.contract import Contract, ContractStatus
from app.models.milestone import Milestone
from app.schemas.proposal import ProposalCreate, ProposalOut
from app.schemas.contract import ContractOut
from app.middleware.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=ProposalOut, status_code=201)
async def submit_proposal(
    data: ProposalCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Project).where(Project.id == data.project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.status != ProjectStatus.OPEN:
        raise HTTPException(status_code=400, detail="Project is no longer accepting proposals")
    if project.client_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot submit a proposal to your own project")

    existing = await db.execute(
        select(Proposal).where(
            Proposal.project_id == data.project_id,
            Proposal.freelancer_id == current_user.id,
            Proposal.status == ProposalStatus.PENDING,
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="You already have a pending proposal for this project")

    proposal = Proposal(
        project_id=data.project_id,
        freelancer_id=current_user.id,
        cover_letter=data.cover_letter,
        proposed_amount=data.proposed_amount,
        estimated_duration=data.estimated_duration,
    )
    db.add(proposal)

    project.proposal_count = project.proposal_count + 1

    await db.flush()
    result = await db.execute(
        select(Proposal).options(selectinload(Proposal.freelancer)).where(Proposal.id == proposal.id)
    )
    return ProposalOut.model_validate(result.scalar_one())


@router.get("/project/{project_id}", response_model=List[ProposalOut])
async def list_proposals(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    proj_result = await db.execute(select(Project).where(Project.id == project_id))
    project = proj_result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the project owner can view proposals")

    result = await db.execute(
        select(Proposal)
        .options(selectinload(Proposal.freelancer))
        .where(Proposal.project_id == project_id)
        .order_by(Proposal.created_at.desc())
    )
    return [ProposalOut.model_validate(p) for p in result.scalars().all()]


@router.get("/my", response_model=List[ProposalOut])
async def my_proposals(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Proposal)
        .options(selectinload(Proposal.freelancer), selectinload(Proposal.project))
        .where(Proposal.freelancer_id == current_user.id)
        .order_by(Proposal.created_at.desc())
    )
    return [ProposalOut.model_validate(p) for p in result.scalars().all()]


@router.post("/{proposal_id}/accept", response_model=ContractOut)
async def accept_proposal(
    proposal_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Accept a proposal -- auto-creates an escrow contract from the project."""
    result = await db.execute(
        select(Proposal)
        .options(selectinload(Proposal.project), selectinload(Proposal.freelancer))
        .where(Proposal.id == proposal_id)
    )
    proposal = result.scalar_one_or_none()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    project = proposal.project
    if project.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the project owner can accept proposals")
    if proposal.status != ProposalStatus.PENDING:
        raise HTTPException(status_code=400, detail="Proposal is no longer pending")

    contract = Contract(
        title=project.title,
        description=project.description,
        client_id=current_user.id,
        freelancer_id=proposal.freelancer_id,
        status=ContractStatus.ACTIVE,
        total_amount=float(proposal.proposed_amount),
        currency=project.currency,
        signed_at=datetime.now(timezone.utc),
    )
    db.add(contract)
    await db.flush()

    milestone = Milestone(
        contract_id=contract.id,
        title=f"Complete: {project.title}",
        description=project.description,
        amount=float(proposal.proposed_amount),
        position=0,
    )
    db.add(milestone)

    proposal.status = ProposalStatus.ACCEPTED
    project.status = ProjectStatus.IN_PROGRESS

    reject_result = await db.execute(
        select(Proposal).where(
            Proposal.project_id == project.id,
            Proposal.id != proposal_id,
            Proposal.status == ProposalStatus.PENDING,
        )
    )
    for other in reject_result.scalars().all():
        other.status = ProposalStatus.REJECTED

    await db.flush()

    contract_result = await db.execute(
        select(Contract)
        .options(
            selectinload(Contract.milestones),
            selectinload(Contract.client),
            selectinload(Contract.freelancer),
        )
        .where(Contract.id == contract.id)
    )
    return ContractOut.model_validate(contract_result.scalar_one())


@router.post("/{proposal_id}/reject")
async def reject_proposal(
    proposal_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Proposal).options(selectinload(Proposal.project)).where(Proposal.id == proposal_id)
    )
    proposal = result.scalar_one_or_none()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    if proposal.project.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the project owner can reject proposals")

    proposal.status = ProposalStatus.REJECTED
    await db.flush()
    return {"status": "rejected"}


@router.post("/{proposal_id}/withdraw")
async def withdraw_proposal(
    proposal_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(Proposal).where(Proposal.id == proposal_id))
    proposal = result.scalar_one_or_none()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    if proposal.freelancer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the proposer can withdraw")

    proposal.status = ProposalStatus.WITHDRAWN
    await db.flush()
    return {"status": "withdrawn"}
