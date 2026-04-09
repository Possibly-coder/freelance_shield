import uuid
from typing import Optional
from fastapi import UploadFile
from app.config import get_settings

settings = get_settings()

try:
    import boto3
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION,
    )
except Exception:
    s3_client = None


async def upload_file(file: UploadFile, folder: str = "deliverables") -> Optional[str]:
    if not s3_client:
        return None

    ext = file.filename.rsplit(".", 1)[-1] if file.filename and "." in file.filename else "bin"
    key = f"{folder}/{uuid.uuid4().hex}.{ext}"

    contents = await file.read()
    s3_client.put_object(
        Bucket=settings.S3_BUCKET_NAME,
        Key=key,
        Body=contents,
        ContentType=file.content_type or "application/octet-stream",
    )
    return f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"
