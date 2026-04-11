use anchor_lang::prelude::*;

pub mod error;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("eUdRS4cqv3emMFX7Ymhg4NDNWKkPQZLyzB8uVki1C27");

#[program]
pub mod freelance_shield {
    use super::*;

    pub fn create_contract(
        ctx: Context<CreateContract>,
        contract_id: u64,
        auto_release_hours: u64,
        milestones: Vec<create_contract::MilestoneInput>,
    ) -> Result<()> {
        instructions::create_contract::handler(ctx, contract_id, auto_release_hours, milestones)
    }

    pub fn init_milestone(ctx: Context<InitMilestone>, index: u8, amount: u64) -> Result<()> {
        instructions::init_milestone::handler(ctx, index, amount)
    }

    pub fn accept_contract(ctx: Context<AcceptContract>) -> Result<()> {
        instructions::accept_contract::handler(ctx)
    }

    pub fn fund_milestone(ctx: Context<FundMilestone>) -> Result<()> {
        instructions::fund_milestone::handler(ctx)
    }

    pub fn submit_milestone(ctx: Context<SubmitMilestone>) -> Result<()> {
        instructions::submit_milestone::handler(ctx)
    }

    pub fn approve_milestone(ctx: Context<ApproveMilestone>) -> Result<()> {
        instructions::approve_milestone::handler(ctx)
    }

    pub fn release_milestone(ctx: Context<ReleaseMilestone>) -> Result<()> {
        instructions::release_milestone::handler(ctx)
    }

    pub fn auto_release(ctx: Context<AutoRelease>) -> Result<()> {
        instructions::auto_release::handler(ctx)
    }

    pub fn raise_dispute(ctx: Context<RaiseDispute>) -> Result<()> {
        instructions::dispute::raise_dispute_handler(ctx)
    }

    pub fn resolve_dispute(ctx: Context<ResolveDispute>, release_to_freelancer: bool) -> Result<()> {
        instructions::dispute::resolve_dispute_handler(ctx, release_to_freelancer)
    }

    pub fn init_trust_score(ctx: Context<InitTrustScore>) -> Result<()> {
        instructions::trust_score::init_handler(ctx)
    }

    pub fn update_trust_on_release(ctx: Context<UpdateTrustOnRelease>, amount: u64, on_time: bool) -> Result<()> {
        instructions::trust_score::update_on_release_handler(ctx, amount, on_time)
    }
}
