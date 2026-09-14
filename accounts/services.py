"""
OTP service for generating, hashing, verifying, and dispatching real-time email verification codes.
"""
import hashlib
import hmac
import secrets
from datetime import timedelta
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import strip_tags

from .models import EmailOTP, User


# Constants (with fallback to settings)
OTP_EXPIRY_MINUTES = getattr(settings, 'OTP_EXPIRY_MINUTES', 5)
OTP_MAX_ATTEMPTS = getattr(settings, 'OTP_MAX_ATTEMPTS', 5)
OTP_COOLDOWN_SECONDS = getattr(settings, 'OTP_COOLDOWN_SECONDS', 60)
OTP_DIGITS = 6


def hash_otp(email: str, otp_code: str) -> str:
    """
    Hash OTP code using HMAC-SHA256 with project SECRET_KEY and user email as salt.
    Prevents plaintext exposure in database.
    """
    secret = settings.SECRET_KEY.encode('utf-8')
    message = f"{email.lower().strip()}:{otp_code.strip()}".encode('utf-8')
    return hmac.new(secret, message, hashlib.sha256).hexdigest()


def generate_secure_otp(digits: int = OTP_DIGITS) -> str:
    """Generate cryptographically secure 6-digit numeric OTP."""
    # Generate random number between 100000 and 999999
    return ''.join(secrets.choice('0123456789') for _ in range(digits))


def get_client_ip(request) -> str:
    """Retrieve client IP address from HTTP headers."""
    if not request:
        return ''
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '')


def create_and_send_otp(email: str, request=None, full_name: str = '') -> dict:
    """
    Generate OTP, record in DB, and send HTML email.
    Returns dict with status, message, and details.
    """
    email = email.lower().strip()

    # 1. Validation: check if email is registered
    if User.objects.filter(email=email).exists():
        return {
            'success': False,
            'code': 'EMAIL_EXISTS',
            'message': 'An account with this email address is already registered. Please log in.',
        }

    # 2. Rate limiting / Cooldown check:
    latest_otp = EmailOTP.objects.filter(email=email, is_used=False).first()
    if latest_otp and not latest_otp.can_resend(OTP_COOLDOWN_SECONDS):
        remaining = latest_otp.seconds_until_resend(OTP_COOLDOWN_SECONDS)
        return {
            'success': False,
            'code': 'COOLDOWN_ACTIVE',
            'message': f'Please wait {remaining} seconds before requesting a new OTP.',
            'remaining_seconds': remaining,
        }

    # 3. Invalidate previous unused OTPs for this email
    EmailOTP.objects.filter(email=email, is_used=False).update(is_used=True)

    # 4. Generate new secure 6-digit OTP
    otp_code = generate_secure_otp()
    hashed_otp = hash_otp(email, otp_code)
    now = timezone.now()
    expires_at = now + timedelta(minutes=OTP_EXPIRY_MINUTES)
    ip = get_client_ip(request)

    # 5. Save to database
    otp_record = EmailOTP.objects.create(
        email=email,
        otp_hash=hashed_otp,
        expires_at=expires_at,
        max_attempts=OTP_MAX_ATTEMPTS,
        ip_address=ip or None,
    )

    # 6. Send Email via SMTP
    email_sent, error_msg = send_otp_email(
        email=email,
        otp_code=otp_code,
        full_name=full_name,
        expiry_minutes=OTP_EXPIRY_MINUTES,
    )

    if not email_sent:
        # Invalidate the OTP record if email failed
        otp_record.is_used = True
        otp_record.save(update_fields=['is_used'])
        return {
            'success': False,
            'code': 'EMAIL_SEND_FAILED',
            'message': f'Failed to send OTP email: {error_msg}',
        }

    return {
        'success': True,
        'code': 'OTP_SENT',
        'message': 'OTP sent successfully to your email.',
        'cooldown_seconds': OTP_COOLDOWN_SECONDS,
        'expires_in_minutes': OTP_EXPIRY_MINUTES,
    }


def send_otp_email(email: str, otp_code: str, full_name: str = '', expiry_minutes: int = 5) -> tuple[bool, str]:
    """
    Send professional HTML email containing the verification code.
    Returns (success: bool, error_message: str).
    """
    subject = 'Your Email Verification Code — Gamified Code Academy'
    from_email = settings.DEFAULT_FROM_EMAIL

    context = {
        'otp_code': otp_code,
        'email': email,
        'full_name': full_name or 'Future Coder',
        'expiry_minutes': expiry_minutes,
        'support_email': getattr(settings, 'SUPPORT_EMAIL', 'support@gamifiedcodeacademy.com'),
        'current_year': timezone.now().year,
    }

    try:
        html_content = render_to_string('emails/otp_verification.html', context)
        text_content = render_to_string('emails/otp_verification.txt', context)
    except Exception:
        # Fallback inline templates if files not loaded
        text_content = (
            f"Your Email Verification Code\n\n"
            f"Your OTP is:\n"
            f"{otp_code}\n\n"
            f"This OTP will expire in {expiry_minutes} minutes.\n"
            f"Do not share this code with anyone.\n\n"
            f"— Gamified Code Academy Team"
        )
        html_content = (
            f"<div style='font-family:sans-serif;padding:20px;max-width:500px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;background:#ffffff;'>"
            f"<h2 style='color:#0f172a;text-align:center;'>Your Email Verification Code</h2>"
            f"<p style='color:#475569;'>Your OTP is:</p>"
            f"<div style='background:#f1f5f9;border-radius:8px;padding:16px;text-align:center;font-size:32px;letter-spacing:8px;font-weight:bold;color:#4f46e5;'>{otp_code}</div>"
            f"<p style='color:#64748b;font-size:14px;margin-top:16px;'>This OTP will expire in <strong>{expiry_minutes} minutes</strong>.</p>"
            f"<p style='color:#ef4444;font-size:13px;font-weight:600;'>Do not share this code with anyone.</p>"
            f"</div>"
        )

    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=from_email,
            to=[email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)
        # Log to terminal for easy dev verification
        print(f"\n=======================================================\n[REAL-TIME OTP DISPATCH] Email: {email} | OTP: {otp_code}\n=======================================================\n")
        return True, ""
    except UnicodeEncodeError:
        # Fallback to ascii-safe text if console backend on Windows encounters charmap codec error
        try:
            ascii_text = text_content.encode('ascii', 'ignore').decode('ascii')
            msg = EmailMultiAlternatives(
                subject='Your Email Verification Code',
                body=ascii_text,
                from_email=from_email,
                to=[email],
            )
            msg.send(fail_silently=False)
            print(f"\n=======================================================\n[REAL-TIME OTP DISPATCH] Email: {email} | OTP: {otp_code}\n=======================================================\n")
            return True, ""
        except Exception as exc:
            return False, str(exc)
    except Exception as exc:
        return False, str(exc)



def verify_otp_submission(email: str, entered_otp: str) -> dict:
    """
    Verify user submitted OTP against database hash.
    Enforces expiry, max attempts, and marks verified.
    """
    email = email.lower().strip()
    entered_otp = entered_otp.strip()

    if not entered_otp or len(entered_otp) != OTP_DIGITS:
        return {
            'success': False,
            'code': 'INVALID_FORMAT',
            'message': 'Please enter a valid 6-digit OTP code.',
        }

    otp_record = EmailOTP.objects.filter(email=email, is_used=False).first()

    if not otp_record:
        return {
            'success': False,
            'code': 'NO_OTP_FOUND',
            'message': 'No active OTP found for this email. Please request a new OTP.',
        }

    # Check expiration
    if otp_record.is_expired:
        return {
            'success': False,
            'code': 'OTP_EXPIRED',
            'message': 'OTP expired. Please request a new OTP.',
        }

    # Check maximum attempts lockout
    if otp_record.attempts >= otp_record.max_attempts:
        return {
            'success': False,
            'code': 'MAX_ATTEMPTS_EXCEEDED',
            'message': 'Maximum attempts exceeded. Please request a new OTP.',
        }

    # Increment attempt count
    otp_record.attempts += 1
    otp_record.save(update_fields=['attempts'])

    # Hash entered OTP and compare securely
    entered_hash = hash_otp(email, entered_otp)
    if not hmac.compare_digest(otp_record.otp_hash, entered_hash):
        remaining = otp_record.remaining_attempts
        if remaining > 0:
            msg = f"Invalid OTP. Please try again. ({remaining} attempt{'s' if remaining != 1 else ''} left)"
        else:
            msg = "Invalid OTP. Maximum attempts exceeded. Please request a new OTP."
        return {
            'success': False,
            'code': 'INVALID_OTP',
            'message': msg,
            'remaining_attempts': remaining,
        }

    # OTP is correct! Mark as verified and generate secure session token
    session_token = secrets.token_urlsafe(32)
    otp_record.is_verified = True
    otp_record.session_token = session_token
    otp_record.save(update_fields=['is_verified', 'session_token'])

    return {
        'success': True,
        'code': 'OTP_VERIFIED',
        'message': 'Email verified successfully ✓',
        'session_token': session_token,
    }


def validate_verified_session(email: str, session_token: str) -> bool:
    """
    Validate that the given email and session_token match a verified, unused OTP.
    """
    if not email or not session_token:
        return False
    email = email.lower().strip()
    return EmailOTP.objects.filter(
        email=email,
        session_token=session_token,
        is_verified=True,
        is_used=False,
    ).exists()


def consume_verified_session(email: str, session_token: str) -> bool:
    """
    Consume the verified session token so it cannot be reused.
    """
    email = email.lower().strip()
    updated = EmailOTP.objects.filter(
        email=email,
        session_token=session_token,
        is_verified=True,
        is_used=False,
    ).update(is_used=True)
    return updated > 0
