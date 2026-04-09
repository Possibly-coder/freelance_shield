from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://freelanceshield:localdev123@localhost:5432/freelanceshield"
    REDIS_URL: str = "redis://localhost:6379/0"

    SECRET_KEY: str = "change-me-to-a-random-string"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""
    RAZORPAY_WEBHOOK_SECRET: str = ""

    RESEND_API_KEY: str = ""
    FROM_EMAIL: str = "noreply@freelanceshield.com"

    S3_BUCKET_NAME: str = "freelanceshield-uploads"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "ap-south-1"

    FRONTEND_URL: str = "http://localhost:3000"

    model_config = {"env_file": ".env", "extra": "ignore"}


@lru_cache
def get_settings() -> Settings:
    return Settings()
