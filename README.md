# FreelanceShield

Programmable trust infrastructure for the service economy. Milestone-based USDC escrow with permissionless auto-release and portable on-chain trust scores, built on Solana.

**Live site:** https://freelance-shield-olive.vercel.app

---

## How to Start the Project (Local Development)

### Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 18+ | https://nodejs.org |
| Python | 3.9+ | `brew install python` or https://python.org |
| Rust | 1.79+ | `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh` |
| Solana CLI | 2.0+ | `sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"` |
| Anchor CLI | 0.31+ | `cargo install --git https://github.com/coral-xyz/anchor avm --force && avm install 0.30.1 && avm use 0.30.1` |
| PostgreSQL | 14+ | `brew install postgresql@14 && brew services start postgresql@14` |
| Redis | 7+ | `brew install redis && brew services start redis` |

After installing Rust and Solana, add to your `~/.zshrc`:

```bash
export PATH="$HOME/.cargo/bin:$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

Then restart your terminal or run `source ~/.zshrc`.

---

### Step 1: Clone the repo

```bash
git clone git@github.com:Possibly-coder/freelance_shield.git
cd freelance_shield
```

### Step 2: Set up the database

```bash
psql postgres -c "CREATE USER freelanceshield WITH PASSWORD 'localdev123';"
psql postgres -c "CREATE DATABASE freelanceshield OWNER freelanceshield;"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE freelanceshield TO freelanceshield;"
```

### Step 3: Start the backend (FastAPI)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your keys (or leave defaults for local dev)
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

Backend runs at http://localhost:8000. API docs at http://localhost:8000/docs.

### Step 4: Start the frontend (Next.js)

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:3000.

### Step 5: Build the Solana program

Open a new terminal:

```bash
# Generate a Solana keypair (first time only)
solana-keygen new --no-bip39-passphrase

# Set to localnet
solana config set --url localhost

# Build the Anchor program
anchor build

# Sync the program ID
anchor keys sync

# Rebuild with synced ID
anchor build
```

### Step 6: Run Solana tests (optional)

```bash
# Start a local Solana validator
solana-test-validator

# In another terminal, run tests
anchor test --skip-local-validator
```

---

## Project Structure

```
FreelanceShield/
│
├── programs/                      # Solana smart contracts (Anchor/Rust)
│   └── freelance-shield/
│       └── src/
│           ├── lib.rs             # Program entry, 12 instructions
│           ├── state.rs           # EscrowContract, Milestone, TrustScore
│           ├── error.rs           # Custom error codes
│           └── instructions/      # One file per instruction
│               ├── create_contract.rs
│               ├── init_milestone.rs
│               ├── accept_contract.rs
│               ├── fund_milestone.rs
│               ├── submit_milestone.rs
│               ├── approve_milestone.rs
│               ├── release_milestone.rs
│               ├── auto_release.rs    # Permissionless crank
│               ├── dispute.rs
│               └── trust_score.rs     # Portable reputation
│
├── backend/                       # FastAPI (Python) -- hybrid off-chain layer
│   ├── app/
│   │   ├── main.py                # FastAPI entry
│   │   ├── config.py              # Environment settings
│   │   ├── database.py            # PostgreSQL connection
│   │   ├── models/                # SQLAlchemy models
│   │   ├── schemas/               # Pydantic schemas
│   │   ├── routers/               # API endpoints
│   │   │   ├── auth.py            # JWT auth
│   │   │   ├── contracts.py       # Contract CRUD
│   │   │   ├── milestones.py      # Milestone management
│   │   │   ├── payments.py        # Razorpay integration
│   │   │   ├── projects.py        # Project board
│   │   │   ├── proposals.py       # Proposal system
│   │   │   ├── disputes.py        # Dispute flow
│   │   │   ├── waitlist.py        # Waitlist + viewer
│   │   │   ├── webhooks.py        # Razorpay webhooks
│   │   │   └── cron.py            # Auto-release cron
│   │   └── services/              # Business logic
│   │       ├── payment_service.py # Razorpay
│   │       ├── email_service.py   # Resend
│   │       └── storage_service.py # S3
│   ├── alembic/                   # Database migrations
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                      # Next.js 16 + Tailwind CSS v4
│   └── src/
│       ├── app/                   # Pages (App Router)
│       │   ├── page.tsx           # Landing page + waitlist
│       │   ├── auth/              # Login, signup
│       │   ├── dashboard/         # User dashboard
│       │   ├── contracts/         # Contract CRUD + detail
│       │   ├── projects/          # Project board + proposals
│       │   ├── how-it-works/      # Static pages
│       │   ├── pricing/
│       │   ├── about/
│       │   ├── blog/
│       │   ├── contact/
│       │   ├── privacy/
│       │   ├── terms/
│       │   └── refund-policy/
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── PageShell.tsx
│       │   ├── StatusBadge.tsx
│       │   └── WalletButton.tsx   # Phantom wallet connect
│       └── lib/
│           ├── api.ts             # Axios API client
│           ├── auth.tsx           # Auth context
│           ├── solana.tsx         # Solana wallet provider + PDA helpers
│           ├── program-client.ts  # Anchor program client (all 12 instructions)
│           ├── idl.json           # Auto-generated IDL
│           └── types.ts           # TypeScript interfaces
│
├── tests/                         # Anchor integration tests
│   └── freelance-shield.ts
│
├── Anchor.toml                    # Anchor config
├── Cargo.toml                     # Rust workspace
├── docker-compose.yml             # Postgres + Redis (optional)
├── HACKATHON_SUBMISSION.md        # Colosseum Frontier submission
├── DEPLOY_SOLANA.md               # Devnet deployment guide
├── SETUP.md                       # Production deployment guide
├── MARKETING.md                   # Twitter/LinkedIn/Reddit content
└── GROWTH_STRATEGY.md             # Growth playbook
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                       │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐  │
│  │ Phantom Wallet│  │  React Pages  │  │  API Client  │  │
│  └──────┬───────┘  └───────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼─────────────────┼───────────┘
          │                  │                 │
          │ Sign tx          │                 │ REST
          ▼                  │                 ▼
┌──────────────────┐         │        ┌──────────────────┐
│  Solana Program  │         │        │  FastAPI Backend  │
│  (Anchor/Rust)   │         │        │  (Python)         │
│                  │         │        │                    │
│  - Escrow vaults │         │        │  - Project board   │
│  - Auto-release  │         │        │  - Waitlist        │
│  - Trust scores  │         │        │  - Proposals       │
│  - USDC payments │         │        │  - Email           │
└──────────────────┘         │        └────────┬───────────┘
          │                  │                 │
          ▼                  │                 ▼
┌──────────────────┐         │        ┌──────────────────┐
│  Solana Blockchain│        │        │   PostgreSQL      │
│  (Devnet/Mainnet)│         │        │   + Redis         │
└──────────────────┘         │        └──────────────────┘
                             │
                    Trust-critical on Solana
                    UX-critical on FastAPI
```

---

## Key Features

| Feature | Where | How |
|---|---|---|
| Milestone escrow | Solana | USDC locked in PDA vaults per milestone |
| Auto-release | Solana | Permissionless crank -- anyone triggers if timer expired |
| Trust scores | Solana | On-chain PDA tracking delivery/payment behavior |
| Project board | FastAPI | Clients post, freelancers apply, auto-creates escrow |
| Waitlist | FastAPI | Email collection with position counter |
| Wallet auth | Frontend | Phantom wallet connect via @solana/wallet-adapter |
| Dispute resolution | Solana | Freeze funds, resolve on-chain |

---

## Environment Variables

### Backend (`backend/.env`)

```
DATABASE_URL=postgresql+asyncpg://freelanceshield:localdev123@localhost:5432/freelanceshield
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=change-me-to-a-random-string
ACCESS_TOKEN_EXPIRE_MINUTES=60
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RESEND_API_KEY=
FROM_EMAIL=noreply@freelanceshield.com
S3_BUCKET_NAME=freelanceshield-uploads
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_PROGRAM_ID=<your-program-id-from-anchor-build>
NEXT_PUBLIC_USDC_MINT=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
```

---

## Useful Commands

```bash
# Backend
cd backend && source venv/bin/activate
uvicorn app.main:app --reload --port 8000    # Start server
alembic revision --autogenerate -m "msg"      # Create migration
alembic upgrade head                          # Apply migrations

# Frontend
cd frontend
npm run dev                                    # Dev server
npm run build                                  # Production build

# Solana
anchor build                                   # Compile program
anchor keys sync                               # Sync program ID
anchor test                                    # Run tests
anchor deploy --provider.cluster devnet        # Deploy to devnet
solana logs <PROGRAM_ID>                       # Watch program logs
```

---

## Deploying to Production

See [SETUP.md](SETUP.md) for full production deployment guide (Railway + Vercel).
See [DEPLOY_SOLANA.md](DEPLOY_SOLANA.md) for Solana devnet/mainnet deployment.

---

## Hackathon

This project is submitted to the **Colosseum Frontier Hackathon** (April 6 - May 11, 2026).
See [HACKATHON_SUBMISSION.md](HACKATHON_SUBMISSION.md) for the full submission document.

---

## License

MIT
