use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use crate::state::*;
use crate::error::ShieldError;

#[derive(Accounts)]
#[instruction(index: u8)]
pub struct InitMilestone<'info> {
    #[account(mut)]
    pub client: Signer<'info>,

    #[account(
        mut,
        has_one = client @ ShieldError::UnauthorizedClient,
    )]
    pub contract: Account<'info, EscrowContract>,

    #[account(
        init,
        payer = client,
        space = 8 + Milestone::INIT_SPACE,
        seeds = [b"milestone", contract.key().as_ref(), &[index]],
        bump,
    )]
    pub milestone: Account<'info, Milestone>,

    pub usdc_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = client,
        token::mint = usdc_mint,
        token::authority = vault,
        seeds = [b"vault", milestone.key().as_ref()],
        bump,
    )]
    pub vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitMilestone>, index: u8, amount: u64) -> Result<()> {
    let milestone = &mut ctx.accounts.milestone;
    milestone.contract = ctx.accounts.contract.key();
    milestone.index = index;
    milestone.amount = amount;
    milestone.status = MilestoneStatus::Pending;
    milestone.funded_at = 0;
    milestone.submitted_at = 0;
    milestone.approved_at = 0;
    milestone.auto_release_at = 0;
    milestone.vault_bump = ctx.bumps.vault;
    milestone.bump = ctx.bumps.milestone;

    Ok(())
}
