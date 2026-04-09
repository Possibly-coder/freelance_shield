# FreelanceShield

Milestone-based freelancer payment escrow platform. Protects both businesses and freelancers with locked payments, milestone tracking, and dispute resolution.

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose (for Postgres + Redis)

### 1. Start databases

```bash
docker-compose up -d
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env
# Edit .env with your Razorpay keys, etc.

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --port 8000
```

API docs available at http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Project Structure

```
FreelanceShield/
  backend/           # FastAPI + SQLAlchemy
    app/
      models/        # Database models
      schemas/       # Pydantic request/response schemas
      routers/       # API endpoints
      services/      # Business logic (payments, email, storage)
      middleware/     # Auth (JWT)
    alembic/         # Database migrations
  frontend/          # Next.js 14 + Tailwind CSS
    src/
      app/           # Pages (App Router)
      components/    # Reusable UI components
      lib/           # API client, auth context, types
  docker-compose.yml # Postgres + Redis
```

## Core Flow

1. **Client** creates a contract with milestones
2. Client shares an **invite link** with their freelancer
3. **Freelancer** accepts the contract
4. Client **funds** each milestone (money held in escrow)
5. Freelancer **submits** deliverables
6. Client **approves** and funds are **released** to freelancer
7. If disagreement, either party can **raise a dispute**

## Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy 2.0, Alembic
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL
- **Cache**: Redis
- **Payments**: Razorpay Route API
- **Email**: Resend
- **Storage**: AWS S3 / Cloudflare R2
