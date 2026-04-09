from typing import Optional, Dict
from app.config import get_settings

settings = get_settings()

try:
    import resend
    resend.api_key = settings.RESEND_API_KEY
except Exception:
    resend = None


async def send_email(to: str, subject: str, html: str) -> Optional[Dict]:
    if not resend or not settings.RESEND_API_KEY:
        return None
    params = {
        "from": settings.FROM_EMAIL,
        "to": [to],
        "subject": subject,
        "html": html,
    }
    return resend.Emails.send(params)


async def send_contract_invite(to_email: str, client_name: str, contract_title: str, invite_url: str):
    html = f"""
    <h2>You've been invited to a contract on FreelanceShield</h2>
    <p><strong>{client_name}</strong> has created a contract: <strong>{contract_title}</strong></p>
    <p>Click the link below to review and accept:</p>
    <a href="{invite_url}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
        View Contract
    </a>
    <p style="margin-top:24px;color:#666;">If you don't have an account, you'll be asked to create one first.</p>
    """
    return await send_email(to_email, f"Contract Invite: {contract_title}", html)


async def send_payment_notification(to_email: str, milestone_title: str, amount: float, currency: str, event: str):
    event_labels = {
        "funded": "Milestone Funded",
        "released": "Payment Released",
        "refunded": "Payment Refunded",
    }
    label = event_labels.get(event, event)
    html = f"""
    <h2>{label}</h2>
    <p>Milestone: <strong>{milestone_title}</strong></p>
    <p>Amount: <strong>{currency} {amount:,.2f}</strong></p>
    """
    return await send_email(to_email, f"FreelanceShield: {label} - {milestone_title}", html)


async def send_dispute_notification(to_email: str, contract_title: str, reason: str, raised_by_name: str):
    html = f"""
    <h2>Dispute Raised</h2>
    <p>A dispute has been raised on contract: <strong>{contract_title}</strong></p>
    <p>Raised by: <strong>{raised_by_name}</strong></p>
    <p>Reason: {reason}</p>
    """
    return await send_email(to_email, f"FreelanceShield: Dispute - {contract_title}", html)
