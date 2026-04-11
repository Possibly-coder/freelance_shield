use anchor_lang::prelude::*;
use crate::state::*;
use crate::error::ShieldError;

#[derive(Accounts)]
pub struct ApproveMilestone<'info> {
    pub client: Signer<'info>,

    #[account(
        has_one = client @ ShieldError::UnauthorizedClient,
    )]
    pub contract: Account<'info, EscrowContract>,

    #[account(
        mut,
        constraint = milestone.contract == contract.key(),
        constraint = milestone.status == MilestoneStatus::Submitted @ ShieldError::InvalidMilestoneStatus,
    )]
    pub milestone: Account<'info, Milestone>,
}

pub fn handler(ctx: Context<ApproveMilestone>) -> Result<()> {
    let milestone = &mut ctx.accounts.milestone;
    milestone.status = MilestoneStatus::Approved;
    milestone.approved_at = Clock::get()?.unix_timestamp;
    Ok(())
}
