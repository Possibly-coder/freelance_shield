use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::error::ShieldError;

#[derive(Accounts)]
pub struct FundMilestone<'info> {
    #[account(mut)]
    pub client: Signer<'info>,

    #[account(
        has_one = client @ ShieldError::UnauthorizedClient,
        constraint = contract.status == ContractStatus::Active @ ShieldError::InvalidContractStatus,
    )]
    pub contract: Account<'info, EscrowContract>,

    #[account(
        mut,
        constraint = milestone.contract == contract.key(),
        constraint = milestone.status == MilestoneStatus::Pending @ ShieldError::InvalidMilestoneStatus,
    )]
    pub milestone: Account<'info, Milestone>,

    #[account(
        mut,
        constraint = client_token_account.owner == client.key(),
    )]
    pub client_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"vault", milestone.key().as_ref()],
        bump = milestone.vault_bump,
    )]
    pub vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<FundMilestone>) -> Result<()> {
    let milestone = &mut ctx.accounts.milestone;
    let amount = milestone.amount;

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.client_token_account.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.client.to_account_info(),
            },
        ),
        amount,
    )?;

    milestone.status = MilestoneStatus::Funded;
    milestone.funded_at = Clock::get()?.unix_timestamp;

    Ok(())
}
