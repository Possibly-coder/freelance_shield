use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct InitTrustScore<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = 8 + TrustScore::INIT_SPACE,
        seeds = [b"trust", user.key().as_ref()],
        bump,
    )]
    pub trust_score: Account<'info, TrustScore>,

    pub system_program: Program<'info, System>,
}

pub fn init_handler(ctx: Context<InitTrustScore>) -> Result<()> {
    let ts = &mut ctx.accounts.trust_score;
    ts.user = ctx.accounts.user.key();
    ts.contracts_completed = 0;
    ts.contracts_funded = 0;
    ts.on_time_deliveries = 0;
    ts.total_deliveries = 0;
    ts.disputes_raised = 0;
    ts.disputes_lost = 0;
    ts.total_paid = 0;
    ts.total_earned = 0;
    ts.bump = ctx.bumps.trust_score;
    Ok(())
}

#[derive(Accounts)]
pub struct UpdateTrustOnRelease<'info> {
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"trust", freelancer_trust.user.as_ref()],
        bump = freelancer_trust.bump,
    )]
    pub freelancer_trust: Account<'info, TrustScore>,

    #[account(
        mut,
        seeds = [b"trust", client_trust.user.as_ref()],
        bump = client_trust.bump,
    )]
    pub client_trust: Account<'info, TrustScore>,
}

pub fn update_on_release_handler(ctx: Context<UpdateTrustOnRelease>, amount: u64, on_time: bool) -> Result<()> {
    let freelancer_ts = &mut ctx.accounts.freelancer_trust;
    freelancer_ts.total_deliveries += 1;
    freelancer_ts.total_earned += amount;
    if on_time {
        freelancer_ts.on_time_deliveries += 1;
    }

    let client_ts = &mut ctx.accounts.client_trust;
    client_ts.contracts_funded += 1;
    client_ts.total_paid += amount;

    Ok(())
}
