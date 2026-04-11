use anchor_lang::prelude::*;
use crate::state::*;
use crate::error::ShieldError;

#[derive(Accounts)]
pub struct AcceptContract<'info> {
    pub freelancer: Signer<'info>,

    #[account(
        mut,
        constraint = contract.status == ContractStatus::Draft @ ShieldError::InvalidContractStatus,
        constraint = contract.freelancer == Pubkey::default() @ ShieldError::FreelancerAlreadyAssigned,
        constraint = contract.client != freelancer.key() @ ShieldError::CannotAcceptOwnContract,
    )]
    pub contract: Account<'info, EscrowContract>,
}

pub fn handler(ctx: Context<AcceptContract>) -> Result<()> {
    let contract = &mut ctx.accounts.contract;
    contract.freelancer = ctx.accounts.freelancer.key();
    contract.status = ContractStatus::Active;
    Ok(())
}
