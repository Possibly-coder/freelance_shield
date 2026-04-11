use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::error::ShieldError;

#[derive(Accounts)]
pub struct ReleaseMilestone<'info> {
    pub client: Signer<'info>,

    #[account(
        has_one = client @ ShieldError::UnauthorizedClient,
    )]
    pub contract: Account<'info, EscrowContract>,

    #[account(
        mut,
        constraint = milestone.contract == contract.key(),
        constraint = milestone.status == MilestoneStatus::Approved @ ShieldError::InvalidMilestoneStatus,
    )]
    pub milestone: Account<'info, Milestone>,

    #[account(
        mut,
        seeds = [b"vault", milestone.key().as_ref()],
        bump = milestone.vault_bump,
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = freelancer_token_account.owner == contract.freelancer,
    )]
    pub freelancer_token_account: Account<'info, TokenAccount>,

    /// CHECK: Used only as PDA signer seed reference
    #[account(
        seeds = [b"vault", milestone.key().as_ref()],
        bump = milestone.vault_bump,
    )]
    pub vault_authority: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<ReleaseMilestone>) -> Result<()> {
    let milestone = &ctx.accounts.milestone;
    let milestone_key = milestone.key();
    let bump = milestone.vault_bump;
    let seeds: &[&[u8]] = &[b"vault", milestone_key.as_ref(), &[bump]];
    let signer_seeds = &[seeds];

    let amount = ctx.accounts.vault.amount;

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.freelancer_token_account.to_account_info(),
                authority: ctx.accounts.vault.to_account_info(),
            },
            signer_seeds,
        ),
        amount,
    )?;

    let milestone = &mut ctx.accounts.milestone.clone();
    ctx.accounts.milestone.status = MilestoneStatus::Released;

    Ok(())
}
