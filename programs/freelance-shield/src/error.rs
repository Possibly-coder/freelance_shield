use anchor_lang::prelude::*;

#[error_code]
pub enum ShieldError {
    #[msg("Only the client can perform this action")]
    UnauthorizedClient,
    #[msg("Only the freelancer can perform this action")]
    UnauthorizedFreelancer,
    #[msg("Contract is not in the expected status")]
    InvalidContractStatus,
    #[msg("Milestone is not in the expected status")]
    InvalidMilestoneStatus,
    #[msg("Cannot accept your own contract")]
    CannotAcceptOwnContract,
    #[msg("Contract already has a freelancer assigned")]
    FreelancerAlreadyAssigned,
    #[msg("Auto-release time has not been reached yet")]
    AutoReleaseNotReady,
    #[msg("Only a contract party can raise a dispute")]
    NotContractParty,
    #[msg("Milestone amounts do not match contract total")]
    AmountMismatch,
    #[msg("Too many milestones (max 10)")]
    TooManyMilestones,
}
