# FreelanceShield -- Colosseum Frontier Hackathon Submission

## One-liner

Trustless milestone-based escrow for freelancers, built on Solana -- protecting $1.5T of freelance payments with on-chain smart contracts.

## Problem

The global freelance economy is worth $1.5 trillion, but the payment infrastructure is broken:

- **68% of freelancers** have been ghosted after delivering work without full payment
- **73% of businesses** have lost money to freelancers who disappeared mid-project
- **Indian freelancers** lose an estimated Rs 4.2 lakh/year to payment defaults
- **Upwork charges 10-20%** for escrow locked inside their marketplace
- **No on-chain solution exists** for freelance milestone payments

Both sides are afraid, and both sides are right to be.

## Solution

FreelanceShield is a hybrid platform that uses **Solana smart contracts for trustless escrow** and a web frontend for the user experience.

### How it works:

1. **Client creates a contract** with milestones and USDC amounts
2. **Client funds each milestone** -- USDC transfers to a program-owned vault (PDA)
3. **Freelancer delivers** and submits work
4. **Client approves** -- funds release instantly from vault to freelancer
5. **Auto-release crank** -- if client goes silent, anyone can trigger release after the deadline. Fully permissionless. No server needed.
6. **Disputes** freeze funds until resolved

### Key differentiators:

- **Trustless**: No custodian. PDAs control funds. Only the program can move money.
- **USDC payments**: Stablecoins, not volatile tokens. Practical for real freelancers.
- **Permissionless auto-release**: The killer feature. A cron-less, serverless timer that ensures freelancers always get paid. Anyone can crank it.
- **Portable trust scores**: On-chain reputation based on real behavior (delivery rate, payment speed, disputes). Any platform can read it.
- **1/10th the cost**: 1-2% vs Upwork's 20%.

## Technical Architecture

### On-chain (Solana program -- Anchor/Rust):
- 12 instructions: create_contract, init_milestone, accept_contract, fund_milestone, submit_milestone, approve_milestone, release_milestone, auto_release, raise_dispute, resolve_dispute, init_trust_score, update_trust_on_release
- PDAs: EscrowContract, Milestone (with individual USDC vault), TrustScore
- SPL Token integration for USDC transfers

### Off-chain (Hybrid backend):
- FastAPI (Python) for project board, proposals, waitlist, email notifications
- PostgreSQL for searchable project data
- Next.js frontend with Phantom wallet integration

### Why hybrid?
Freelancers need search, filtering, file uploads, and email -- things that don't belong on-chain. We put the trust-critical pieces (money, reputation) on Solana and keep the UX pieces off-chain. Past Colosseum winners (TapeDrive, Reflect Protocol) used this same pattern.

## Tech Stack

| Layer | Technology |
|---|---|
| Smart contracts | Anchor 0.31, Rust, Solana |
| Token | USDC (SPL Token) |
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Wallet | Phantom via @solana/wallet-adapter |
| Backend (hybrid) | FastAPI, PostgreSQL |
| Hosting | Vercel (frontend), Railway (backend) |

## Traction

- Live waitlist at https://freelance-shield-olive.vercel.app
- [X]+ signups with zero ad spend
- Active social media presence (Twitter, LinkedIn, Reddit)
- Featured in Razorpay's Fix My Itch campaign context

## Demo

[Link to 3-min demo video]

## Repo

https://github.com/Possibly-coder/freelance_shield

## Team

Solo founder -- Pawan Kumar Gaikwad
- Software engineer with experience in Python, React, and now Solana
- Built the full stack solo in under 2 weeks
- Personally experienced both sides of the freelance payment problem

## What's Next

1. Deploy to Solana mainnet with real USDC
2. Launch beta with first 50 waitlist users
3. Add file upload for deliverables (Arweave/Shadow Drive)
4. Build mobile app
5. Apply to Colosseum Accelerator for $250K pre-seed

## Public Goods Angle

**Trust scores are a public good.** Any platform, marketplace, or hiring tool can read a freelancer's or client's on-chain reputation. This creates a portable, censorship-resistant reputation layer for the entire freelance economy -- not locked inside any single platform.
