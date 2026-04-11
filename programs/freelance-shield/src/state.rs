use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct EscrowContract {
    pub client: Pubkey,
    pub freelancer: Pubkey,
    pub contract_id: u64,
    pub milestone_count: u8,
    pub total_amount: u64,
    pub auto_release_hours: u64,
    pub status: ContractStatus,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Milestone {
    pub contract: Pubkey,
    pub index: u8,
    pub amount: u64,
    pub status: MilestoneStatus,
    pub funded_at: i64,
    pub submitted_at: i64,
    pub approved_at: i64,
    pub auto_release_at: i64,
    pub vault_bump: u8,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct TrustScore {
    pub user: Pubkey,
    pub contracts_completed: u32,
    pub contracts_funded: u32,
    pub on_time_deliveries: u32,
    pub total_deliveries: u32,
    pub disputes_raised: u32,
    pub disputes_lost: u32,
    pub total_paid: u64,
    pub total_earned: u64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum ContractStatus {
    Draft,
    Active,
    Completed,
    Disputed,
    Cancelled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum MilestoneStatus {
    Pending,
    Funded,
    Submitted,
    Approved,
    Disputed,
    Released,
}
