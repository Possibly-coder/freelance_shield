use anchor_lang::prelude::*;
use crate::state::*;
use crate::error::ShieldError;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct MilestoneInput {
    pub amount: u64,
}

#[derive(Accounts)]
#[instruction(contract_id: u64, auto_release_hours: u64, milestones: Vec<MilestoneInput>)]
pub struct CreateContract<'info> {
    #[account(mut)]
    pub client: Signer<'info>,

    #[account(
        init,
        payer = client,
        space = 8 + EscrowContract::INIT_SPACE,
        seeds = [b"contract", client.key().as_ref(), &contract_id.to_le_bytes()],
        bump,
    )]
    pub contract: Account<'info, EscrowContract>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateContract>,
    contract_id: u64,
    auto_release_hours: u64,
    milestones: Vec<MilestoneInput>,
) -> Result<()> {
    require!(milestones.len() <= 10, ShieldError::TooManyMilestones);
    require!(!milestones.is_empty(), ShieldError::AmountMismatch);

    let total: u64 = milestones.iter().map(|m| m.amount).sum();

    let contract = &mut ctx.accounts.contract;
    contract.client = ctx.accounts.client.key();
    contract.freelancer = Pubkey::default();
    contract.contract_id = contract_id;
    contract.milestone_count = milestones.len() as u8;
    contract.total_amount = total;
    contract.auto_release_hours = auto_release_hours;
    contract.status = ContractStatus::Draft;
    contract.created_at = Clock::get()?.unix_timestamp;
    contract.bump = ctx.bumps.contract;

    Ok(())
}
