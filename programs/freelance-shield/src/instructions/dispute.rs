use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::error::ShieldError;

#[derive(Accounts)]
pub struct RaiseDispute<'info> {
    pub raiser: Signer<'info>,

    #[account(
        mut,
        constraint = (contract.client == raiser.key() || contract.freelancer == raiser.key()) @ ShieldError::NotContractParty,
    )]
    pub contract: Account<'info, EscrowContract>,

    #[account(
        mut,
        constraint = milestone.contract == contract.key(),
        constraint = milestone.status == MilestoneStatus::Funded || milestone.status == MilestoneStatus::Submitted @ ShieldError::InvalidMilestoneStatus,
    )]
    pub milestone: Account<'info, Milestone>,
}

pub fn raise_dispute_handler(ctx: Context<RaiseDispute>) -> Result<()> {
    ctx.accounts.milestone.status = MilestoneStatus::Disputed;
    ctx.accounts.contract.status = ContractStatus::Disputed;
    Ok(())
}

#[derive(Accounts)]
pub struct ResolveDispute<'info> {
    pub client: Signer<'info>,

    #[account(
        mut,
        has_one = client @ ShieldError::UnauthorizedClient,
        constraint = contract.status == ContractStatus::Disputed @ ShieldError::InvalidContractStatus,
    )]
    pub contract: Account<'info, EscrowContract>,

    #[account(
        mut,
        constraint = milestone.contract == contract.key(),
        constraint = milestone.status == MilestoneStatus::Disputed @ ShieldError::InvalidMilestoneStatus,
    )]
    pub milestone: Account<'info, Milestone>,

    #[account(
        mut,
        seeds = [b"vault", milestone.key().as_ref()],
        bump = milestone.vault_bump,
    )]
    pub vault: Account<'info, TokenAccount>,

    /// The recipient -- either client or freelancer depending on resolution
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn resolve_dispute_handler(ctx: Context<ResolveDispute>, release_to_freelancer: bool) -> Result<()> {
    let milestone_key = ctx.accounts.milestone.key();
    let bump = ctx.accounts.milestone.vault_bump;
    let seeds: &[&[u8]] = &[b"vault", milestone_key.as_ref(), &[bump]];
    let signer_seeds = &[seeds];

    let amount = ctx.accounts.vault.amount;

    if amount > 0 {
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.recipient_token_account.to_account_info(),
                    authority: ctx.accounts.vault.to_account_info(),
                },
                signer_seeds,
            ),
            amount,
        )?;
    }

    ctx.accounts.milestone.status = if release_to_freelancer {
        MilestoneStatus::Released
    } else {
        MilestoneStatus::Pending
    };
    ctx.accounts.contract.status = ContractStatus::Active;

    Ok(())
}
