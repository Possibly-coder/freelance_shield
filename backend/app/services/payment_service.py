import hashlib
import hmac
import uuid
from typing import Optional, Dict
from app.config import get_settings

settings = get_settings()

try:
    import razorpay
    rzp_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
except Exception:
    rzp_client = None


def create_razorpay_order(amount_paise: int, currency: str, receipt: str, notes: Optional[Dict] = None) -> dict:
    """Create a Razorpay order. Amount is in paise (INR) or smallest currency unit."""
    if not rzp_client:
        raise RuntimeError("Razorpay client not configured")
    data = {
        "amount": amount_paise,
        "currency": currency,
        "receipt": receipt,
        "notes": notes or {},
    }
    return rzp_client.order.create(data=data)


def verify_payment_signature(order_id: str, payment_id: str, signature: str) -> bool:
    """Verify Razorpay payment signature."""
    message = f"{order_id}|{payment_id}"
    expected = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(),
        message.encode(),
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


def create_transfer(payment_id: str, amount_paise: int, account_id: str, notes: Optional[Dict] = None) -> dict:
    """Transfer funds from platform to freelancer's linked account via Route API."""
    if not rzp_client:
        raise RuntimeError("Razorpay client not configured")
    return rzp_client.payment.transfer(
        payment_id,
        {
            "transfers": [
                {
                    "account": account_id,
                    "amount": amount_paise,
                    "currency": "INR",
                    "notes": notes or {},
                }
            ]
        },
    )


def create_refund(payment_id: str, amount_paise: int) -> dict:
    """Refund a captured payment."""
    if not rzp_client:
        raise RuntimeError("Razorpay client not configured")
    return rzp_client.payment.refund(payment_id, amount_paise)


def generate_idempotency_key(milestone_id: uuid.UUID, payment_type: str) -> str:
    return f"{milestone_id}:{payment_type}:{uuid.uuid4().hex[:8]}"


def verify_webhook_signature(body: bytes, signature: str) -> bool:
    expected = hmac.new(
        settings.RAZORPAY_WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
