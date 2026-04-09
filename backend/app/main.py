from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routers import auth, contracts, milestones, payments, disputes, webhooks, projects, proposals, waitlist, cron

settings = get_settings()

app = FastAPI(
    title="FreelanceShield",
    description="Milestone-based freelancer payment escrow platform",
    version="0.1.0",
)

origins = [
    settings.FRONTEND_URL.rstrip("/"),
    "https://freelance-shield-olive.vercel.app",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(contracts.router, prefix="/api/contracts", tags=["contracts"])
app.include_router(milestones.router, prefix="/api/milestones", tags=["milestones"])
app.include_router(payments.router, prefix="/api/payments", tags=["payments"])
app.include_router(disputes.router, prefix="/api/disputes", tags=["disputes"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(proposals.router, prefix="/api/proposals", tags=["proposals"])
app.include_router(waitlist.router, prefix="/api/waitlist", tags=["waitlist"])
app.include_router(cron.router, prefix="/api/cron", tags=["cron"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}
