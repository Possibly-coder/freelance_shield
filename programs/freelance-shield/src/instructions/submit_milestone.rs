use anchor_lang::prelude::*;
use crate::state::*;
use crate::error::ShieldError;

#[derive(Accounts)]
pub struct SubmitMilestone<'info> {
    pub freelancer: Signer<'info>,

    #[account(
        constraint = contract.freelancer == freelancer.key() @ ShieldError::UnauthorizedFreelancer,
    )]
    pub contract: Account<'info, EscrowContract>,

    #[account(
        mut,
        constraint = milestone.contract == contract.key(),
        constraint = milestone.status == MilestoneStatus::Funded @ ShieldError::InvalidMilestoneStatus,
    )]
    pub milestone: Account<'info, Milestone>,
}

pub fn handler(ctx: Context<SubmitMilestone>) -> Result<()> {
    let milestone = &mut ctx.accounts.milestone;
    let now = Clock::get()?.unix_timestamp;

    milestone.status = MilestoneStatus::Submitted;
    milestone.submitted_at = now;
    milestone.auto_release_at = now + (ctx.accounts.contract.auto_release_hours as i64 * 3600);

    Ok(())
}
