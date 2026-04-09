# FreelanceShield -- Setup & Deployment Guide

Everything you need to go from a fresh clone to running locally, and then to shipping to production.

---

## Part 1: Local Development Setup

### Prerequisites


| Tool       | Version | Check                    |
| ---------- | ------- | ------------------------ |
| Python     | 3.9+    | `python3 --version`      |
| Node.js    | 18+     | `node --version`         |
| PostgreSQL | 14+     | `psql --version`         |
| Redis      | 7+      | `redis-server --version` |
| Git        | any     | `git --version`          |


You can install Postgres and Redis via Homebrew (`brew install postgresql@14 redis`) or Docker.

---

### Step 1: Clone and enter the project

```bash
cd ~/Documents/FreelanceShield
```

### Step 2: Start databases

**Option A -- Homebrew (macOS, already installed):**

```bash
brew services start postgresql@14
brew services start redis
```

**Option B -- Docker:**

```bash
docker compose up -d
```

### Step 3: Create the database

```bash
psql postgres -c "CREATE USER freelanceshield WITH PASSWORD 'localdev123';"
psql postgres -c "CREATE DATABASE freelanceshield OWNER freelanceshield;"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE freelanceshield TO freelanceshield;"
```

### Step 4: Backend setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file
cp .env.example .env
# Edit .env with your actual keys (see "Environment Variables" section below)

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

The API is now running at **[http://localhost:8000](http://localhost:8000)**

- Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Health check: [http://localhost:8000/api/health](http://localhost:8000/api/health)

### Step 5: Frontend setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The frontend is now running at **[http://localhost:3000](http://localhost:3000)**

### Step 6: Verify everything works

1. Open [http://localhost:3000](http://localhost:3000) -- you should see the landing page
2. Click "Get Started" and create an account
3. Create a contract or post a project

---

## Environment Variables Reference

### Backend (`backend/.env`)


| Variable                      | Description                       | Local Default                                                                     | Production                           |
| ----------------------------- | --------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------ |
| `DATABASE_URL`                | Postgres connection string        | `postgresql+asyncpg://freelanceshield:localdev123@localhost:5432/freelanceshield` | Your managed Postgres URL            |
| `REDIS_URL`                   | Redis connection string           | `redis://localhost:6379/0`                                                        | Your managed Redis URL               |
| `SECRET_KEY`                  | JWT signing secret (min 32 chars) | `change-me-to-a-random-string`                                                    | Generate with `openssl rand -hex 32` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token lifetime                | `60`                                                                              | `60` (or shorter for security)       |
| `RAZORPAY_KEY_ID`             | Razorpay API key                  | `rzp_test_xxxxx`                                                                  | Your live key (`rzp_live_...`)       |
| `RAZORPAY_KEY_SECRET`         | Razorpay secret                   | (test secret)                                                                     | Your live secret                     |
| `RAZORPAY_WEBHOOK_SECRET`     | Webhook signature secret          | (test secret)                                                                     | From Razorpay dashboard              |
| `RESEND_API_KEY`              | Resend email API key              | `re_xxxxx`                                                                        | Your Resend API key                  |
| `FROM_EMAIL`                  | Sender email address              | `noreply@freelanceshield.com`                                                     | Your verified domain email           |
| `S3_BUCKET_NAME`              | S3 bucket for file uploads        | `freelanceshield-uploads`                                                         | Your production bucket               |
| `AWS_ACCESS_KEY_ID`           | AWS access key                    | (empty)                                                                           | Your IAM key                         |
| `AWS_SECRET_ACCESS_KEY`       | AWS secret key                    | (empty)                                                                           | Your IAM secret                      |
| `AWS_REGION`                  | AWS region                        | `ap-south-1`                                                                      | Your bucket's region                 |
| `FRONTEND_URL`                | Frontend origin for CORS          | `http://localhost:3000`                                                           | `https://yourdomain.com`             |


### Frontend (`frontend/.env.local`)


| Variable              | Description          | Local Default               | Production                       |
| --------------------- | -------------------- | --------------------------- | -------------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000/api` | `https://api.yourdomain.com/api` |


---

## Part 2: Production Deployment

### Recommended Hosting Stack


| Component        | Recommended Service                 | Why                                      |
| ---------------- | ----------------------------------- | ---------------------------------------- |
| **Backend**      | Railway, Render, or AWS ECS         | Easy deploy, auto-scaling                |
| **Frontend**     | Vercel                              | Built for Next.js, free tier, global CDN |
| **PostgreSQL**   | Supabase, Neon, or Railway Postgres | Managed, auto-backups                    |
| **Redis**        | Upstash or Railway Redis            | Serverless Redis, pay-per-use            |
| **File Storage** | AWS S3 or Cloudflare R2             | R2 has no egress fees                    |
| **Domain**       | Cloudflare (DNS + proxy)            | Free SSL, DDoS protection                |
| **Email**        | Resend                              | Simple transactional email API           |


---

### Backend Deployment (Railway / Render)

1. Push code to GitHub
2. Connect the repo to Railway/Render
3. Set the build command:
  ```
   cd backend && pip install -r requirements.txt && alembic upgrade head
  ```
4. Set the start command:
  ```
   cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```
5. Add all environment variables from the table above
6. Set `FRONTEND_URL` to your Vercel domain

### Frontend Deployment (Vercel)

1. Connect the `frontend/` directory to Vercel
2. Set root directory to `frontend`
3. Add environment variable:
  ```
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
  ```
4. Deploy -- Vercel auto-detects Next.js

### Database Migration on Deploy

Migrations should run automatically if you include `alembic upgrade head` in your build command. If deploying manually:

```bash
# SSH into your server or run via Railway CLI
cd backend
source venv/bin/activate
alembic upgrade head
```

---

## Part 3: Production Changes Required

These are code/config changes needed before going live.

### 1. Security hardening

**Generate a strong SECRET_KEY:**

```bash
openssl rand -hex 32
```

**Restrict CORS origins** -- currently allows `localhost`. In production, `FRONTEND_URL` should be your exact domain:

```
FRONTEND_URL=https://freelanceshield.com
```

**Disable Swagger docs in production** -- add to `backend/app/main.py`:

```python
import os
docs_url = "/docs" if os.getenv("ENVIRONMENT") != "production" else None
app = FastAPI(..., docs_url=docs_url, redoc_url=None)
```

### 2. Razorpay: Switch from test to live

1. Go to [https://dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Toggle from "Test Mode" to "Live Mode"
3. Complete KYC verification
4. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to live keys
5. Set up a webhook endpoint pointing to `https://api.yourdomain.com/api/webhooks/razorpay`
6. Copy the webhook secret to `RAZORPAY_WEBHOOK_SECRET`

### 3. Email: Verify your domain

1. Sign up at [https://resend.com](https://resend.com)
2. Add and verify your domain (DNS records)
3. Update `FROM_EMAIL` to use your verified domain
4. Update `RESEND_API_KEY` with your production key

### 4. File storage: Create S3 bucket

1. Create an S3 bucket (or Cloudflare R2 bucket)
2. Create an IAM user with `s3:PutObject` and `s3:GetObject` permissions
3. Set bucket CORS policy to allow your frontend domain
4. Update the AWS environment variables

### 5. Database: Use managed Postgres

- Use Supabase, Neon, or Railway Postgres
- Enable SSL connections
- Set up automated daily backups
- Update `DATABASE_URL` with the connection string

---

## Part 4: Pre-Deployment Checklist

Check each item before shipping to production.

### Security

- `SECRET_KEY` is a unique, random 32+ character string (not the default)
- `RAZORPAY_KEY_ID` uses live keys (starts with `rzp_live_`), not test keys
- `RAZORPAY_WEBHOOK_SECRET` is set and webhook URL is registered in Razorpay dashboard
- `FRONTEND_URL` is set to your exact production domain (no trailing slash)
- CORS does not allow `localhost` or `*` in production
- Swagger docs (`/docs`) are disabled in production
- `.env` file is in `.gitignore` and is NOT committed to git
- Database password is strong and unique (not `localdev123`)
- JWT `ACCESS_TOKEN_EXPIRE_MINUTES` is reasonable (30-60 min)

### Infrastructure

- PostgreSQL is a managed service with automated backups
- Redis is a managed service (Upstash or equivalent)
- S3 / R2 bucket is created with proper CORS and IAM permissions
- SSL/TLS is enabled on all endpoints (HTTPS only)
- Custom domain is configured with DNS pointing to backend + frontend
- Backend health check (`/api/health`) returns 200

### Payments (Razorpay)

- Razorpay KYC is completed and account is in live mode
- Webhook endpoint is registered: `https://api.yourdomain.com/api/webhooks/razorpay`
- Webhook events enabled: `payment.captured`, `payment.failed`, `transfer.processed`
- Test a real payment end-to-end with a small amount (INR 1)
- Verify webhook signature validation works with live secret

### Email

- Resend API key is set
- Sender domain is verified in Resend dashboard
- `FROM_EMAIL` uses the verified domain
- Test emails are delivered (check spam folder too)

### Database

- All migrations are applied (`alembic upgrade head`)
- No test/demo data exists in production database
- Database connection uses SSL (`?sslmode=require` in URL)

### Frontend

- `NEXT_PUBLIC_API_URL` points to the production API
- No `localhost` URLs remain in the frontend code
- `next build` completes with zero errors
- All pages load correctly on mobile (responsive check)
- Favicon and meta tags are set for SEO

### Monitoring (post-launch)

- Error tracking is set up (Sentry or equivalent)
- Uptime monitoring on `/api/health` (UptimeRobot, Betterstack)
- Database backup schedule verified (daily minimum)
- Log aggregation set up (Railway logs, Papertrail, or equivalent)

---

## Common Commands Reference

```bash
# --- Backend ---
cd backend && source venv/bin/activate

# Start dev server
uvicorn app.main:app --reload --port 8000

# Create a new migration after model changes
alembic revision --autogenerate -m "describe the change"

# Apply migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1

# --- Frontend ---
cd frontend

# Dev server
npm run dev

# Production build (check for errors)
npm run build

# Start production server
npm start

# --- Database ---
# Connect to local database
psql -U freelanceshield -d freelanceshield

# Dump database (backup)
pg_dump -U freelanceshield freelanceshield > backup.sql

# Restore from backup
psql -U freelanceshield freelanceshield < backup.sql
```

---

## Troubleshooting


| Problem                             | Fix                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------- |
| `command not found: docker-compose` | Use `docker compose` (no hyphen) on modern Docker                               |
| `bcrypt` / `passlib` error          | We use `bcrypt` directly, not `passlib`. Ensure `bcrypt==4.2.1` in requirements |
| `str                                | None` type error                                                                |
| CORS errors in browser              | Check `FRONTEND_URL` in `.env` matches your frontend origin exactly             |
| Razorpay 401 errors                 | Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are correct                  |
| Webhook not triggering              | Ensure webhook URL is publicly accessible (not localhost)                       |
| Migration fails                     | Check `DATABASE_URL` in `.env` and that Postgres is running                     |
| Frontend build fails                | Run `npm install` first, then `npm run build` to see errors                     |


