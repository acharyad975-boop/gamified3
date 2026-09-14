"""
Unit and integration tests for the Email OTP Authentication System.
"""
from datetime import timedelta
from unittest.mock import patch
from django.test import TestCase, Client
from django.core import mail
from django.utils import timezone
from django.urls import reverse

from accounts.models import User, EmailOTP, StudentProfile
from accounts.services import (
    create_and_send_otp,
    verify_otp_submission,
    validate_verified_session,
    consume_verified_session,
    hash_otp,
    generate_secure_otp,
    OTP_EXPIRY_MINUTES,
    OTP_MAX_ATTEMPTS,
    OTP_COOLDOWN_SECONDS,
)


class EmailOTPServiceTests(TestCase):
    """Test OTP generation, storage, email dispatch, verification, and rate-limiting."""

    def setUp(self):
        self.email = "student@example.com"
        self.full_name = "Alex Morgan"

    def test_otp_generation_and_hashing(self):
        """Verify 6-digit generation and cryptographic HMAC hashing."""
        otp = generate_secure_otp()
        self.assertEqual(len(otp), 6)
        self.assertTrue(otp.isdigit())

        h1 = hash_otp(self.email, otp)
        h2 = hash_otp(self.email, otp)
        self.assertEqual(h1, h2)
        # Verify salt prevents identical hash for different emails
        h_diff = hash_otp("other@example.com", otp)
        self.assertNotEqual(h1, h_diff)

    def test_send_otp_success(self):
        """Test successful OTP generation, database record, and email delivery."""
        result = create_and_send_otp(email=self.email, full_name=self.full_name)
        self.assertTrue(result['success'])
        self.assertEqual(result['code'], 'OTP_SENT')
        self.assertEqual(result['message'], 'OTP sent successfully to your email.')

        # Check DB record
        otp_record = EmailOTP.objects.filter(email=self.email, is_used=False).first()
        self.assertIsNotNone(otp_record)
        self.assertFalse(otp_record.is_verified)
        self.assertFalse(otp_record.is_expired)

        # Check outbox email
        self.assertEqual(len(mail.outbox), 1)
        sent_mail = mail.outbox[0]
        self.assertIn("Your Email Verification Code", sent_mail.subject)
        self.assertIn(self.email, sent_mail.to)
        self.assertIn("This OTP will expire in 5 minutes.", sent_mail.body)

    def test_already_registered_email_rejected(self):
        """Test that Send OTP rejects emails that are already registered."""
        User.objects.create_user(
            username="existinguser",
            email=self.email,
            password="StrongPassword123!",
            first_name="Existing",
            last_name="User",
        )

        result = create_and_send_otp(email=self.email)
        self.assertFalse(result['success'])
        self.assertEqual(result['code'], 'EMAIL_EXISTS')
        self.assertIn('already registered', result['message'])

    def test_resend_otp_cooldown(self):
        """Test that requesting OTP before 60 seconds is blocked."""
        # First send
        res1 = create_and_send_otp(email=self.email)
        self.assertTrue(res1['success'])

        # Immediate second send should be blocked
        res2 = create_and_send_otp(email=self.email)
        self.assertFalse(res2['success'])
        self.assertEqual(res2['code'], 'COOLDOWN_ACTIVE')
        self.assertIn('Please wait', res2['message'])

    def test_verify_valid_otp(self):
        """Test successful OTP verification with correct code."""
        # Create OTP record with known code
        known_code = "482915"
        EmailOTP.objects.create(
            email=self.email,
            otp_hash=hash_otp(self.email, known_code),
            expires_at=timezone.now() + timedelta(minutes=5),
        )

        result = verify_otp_submission(email=self.email, entered_otp=known_code)
        self.assertTrue(result['success'])
        self.assertEqual(result['code'], 'OTP_VERIFIED')
        self.assertEqual(result['message'], 'Email verified successfully ✓')
        self.assertTrue(bool(result.get('session_token')))

        # Check database is marked verified
        otp_record = EmailOTP.objects.get(email=self.email)
        self.assertTrue(otp_record.is_verified)
        self.assertEqual(otp_record.session_token, result['session_token'])

    def test_verify_wrong_otp(self):
        """Test entering incorrect OTP displays error and increments attempt count."""
        known_code = "482915"
        EmailOTP.objects.create(
            email=self.email,
            otp_hash=hash_otp(self.email, known_code),
            expires_at=timezone.now() + timedelta(minutes=5),
        )

        result = verify_otp_submission(email=self.email, entered_otp="111111")
        self.assertFalse(result['success'])
        self.assertEqual(result['code'], 'INVALID_OTP')
        self.assertIn('Invalid OTP. Please try again.', result['message'])
        self.assertEqual(result['remaining_attempts'], 4)

        # Check DB attempt count
        otp_record = EmailOTP.objects.get(email=self.email)
        self.assertEqual(otp_record.attempts, 1)

    def test_verify_max_attempts_exceeded(self):
        """Test entering wrong OTP 5 times locks out further verification."""
        known_code = "482915"
        EmailOTP.objects.create(
            email=self.email,
            otp_hash=hash_otp(self.email, known_code),
            expires_at=timezone.now() + timedelta(minutes=5),
            attempts=5,
        )

        result = verify_otp_submission(email=self.email, entered_otp=known_code)
        self.assertFalse(result['success'])
        self.assertEqual(result['code'], 'MAX_ATTEMPTS_EXCEEDED')
        self.assertIn('Maximum attempts exceeded', result['message'])

    def test_verify_expired_otp(self):
        """Test verification of expired OTP (> 5 minutes) is rejected."""
        known_code = "482915"
        # Created 6 minutes ago
        EmailOTP.objects.create(
            email=self.email,
            otp_hash=hash_otp(self.email, known_code),
            expires_at=timezone.now() - timedelta(minutes=1),
        )

        result = verify_otp_submission(email=self.email, entered_otp=known_code)
        self.assertFalse(result['success'])
        self.assertEqual(result['code'], 'OTP_EXPIRED')
        self.assertEqual(result['message'], 'OTP expired. Please request a new OTP.')


class RegistrationViewsTests(TestCase):
    """Test AJAX endpoints and complete registration workflow."""

    def setUp(self):
        self.client = Client()
        self.email = "coder@academy.org"

    def test_send_otp_endpoint(self):
        """Test POST /api/send-otp/ endpoint returns valid JSON."""
        response = self.client.post(
            reverse('send_registration_otp'),
            data={'email': self.email, 'full_name': 'Taylor Swift'},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['code'], 'OTP_SENT')

    def test_verify_otp_endpoint(self):
        """Test POST /api/verify-otp/ endpoint."""
        known_code = "654321"
        EmailOTP.objects.create(
            email=self.email,
            otp_hash=hash_otp(self.email, known_code),
            expires_at=timezone.now() + timedelta(minutes=5),
        )

        response = self.client.post(
            reverse('verify_registration_otp'),
            data={'email': self.email, 'otp': known_code},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['message'], 'Email verified successfully ✓')
        self.assertTrue(bool(data['session_token']))

    def test_registration_requires_email_verification(self):
        """Test that submitting registration without verified OTP fails."""
        response = self.client.post(
            reverse('register'),
            data={
                'first_name': 'John',
                'last_name': 'Doe',
                'username': 'johndoe',
                'email': self.email,
                'password': 'StrongPassword123!',
                'confirm_password': 'StrongPassword123!',
                'terms': 'on',
            },
        )
        # Form returns with validation error
        self.assertEqual(response.status_code, 200)
        self.assertFalse(User.objects.filter(email=self.email).exists())
        self.assertContains(response, 'Please verify your email address')

    def test_complete_registration_with_verified_otp(self):
        """Test end-to-end registration success when OTP has been verified."""
        # 1. Simulate verified OTP in database
        otp_record = EmailOTP.objects.create(
            email=self.email,
            otp_hash=hash_otp(self.email, "123456"),
            expires_at=timezone.now() + timedelta(minutes=5),
            is_verified=True,
            session_token="test_token_abc_123",
        )

        # 2. Submit registration
        response = self.client.post(
            reverse('register'),
            data={
                'full_name': 'Alex Coder',
                'username': 'alexcoder',
                'email': self.email,
                'password': 'SuperSecretPassword123!',
                'confirm_password': 'SuperSecretPassword123!',
                'school_class': 'Grade 10',
                'terms': 'on',
                'session_token': 'test_token_abc_123',
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Welcome')
        self.assertContains(response, 'Alex')
        self.assertContains(response, 'Email Verified &amp; Account Created')

        # Verify user created
        user = User.objects.filter(email=self.email).first()
        self.assertIsNotNone(user)
        self.assertTrue(user.is_email_verified)
        self.assertEqual(user.first_name, 'Alex')
        self.assertEqual(user.last_name, 'Coder')

        # Verify profile created
        profile = StudentProfile.objects.filter(user=user).first()
        self.assertIsNotNone(profile)
        self.assertEqual(profile.school_class, 'Grade 10')

        # Verify OTP record is consumed (is_used = True)
        otp_record.refresh_from_db()
        self.assertTrue(otp_record.is_used)


class RoleBasedAuthorizationTests(TestCase):
    """Integration tests verifying strict role-based access control (RBAC)."""

    def setUp(self):
        self.client = Client()
        self.student = User.objects.create_user(
            username="student1",
            email="student1@test.org",
            password="Password123!",
            role=User.Role.STUDENT,
            is_email_verified=True
        )
        self.teacher = User.objects.create_user(
            username="teacher1",
            email="teacher1@test.org",
            password="Password123!",
            role=User.Role.TEACHER,
            is_email_verified=True
        )
        self.admin = User.objects.create_user(
            username="admin1",
            email="admin1@test.org",
            password="Password123!",
            role=User.Role.ADMIN,
            is_email_verified=True
        )

    def test_student_blocked_from_teacher_overview(self):
        """Student accessing /api/teacher/overview/ must receive 403 Forbidden."""
        self.client.force_login(self.student)
        response = self.client.get('/api/teacher/overview/')
        self.assertEqual(response.status_code, 403)
        self.assertIn("403 Forbidden", response.json().get('error', ''))

    def test_student_blocked_from_teacher_students_list(self):
        """Student accessing /api/teacher/students/ must receive 403 Forbidden."""
        self.client.force_login(self.student)
        response = self.client.get('/api/teacher/students/')
        self.assertEqual(response.status_code, 403)

    def test_student_blocked_from_admin_overview(self):
        """Student accessing /api/admin-api/overview/ must receive 403 Forbidden."""
        self.client.force_login(self.student)
        response = self.client.get('/api/admin-api/overview/')
        self.assertEqual(response.status_code, 403)

    def test_teacher_allowed_on_teacher_overview(self):
        """Teacher accessing /api/teacher/overview/ must succeed with 200 OK."""
        self.client.force_login(self.teacher)
        response = self.client.get('/api/teacher/overview/')
        self.assertEqual(response.status_code, 200)

    def test_teacher_blocked_from_admin_overview(self):
        """Teacher accessing /api/admin-api/overview/ must receive 403 Forbidden."""
        self.client.force_login(self.teacher)
        response = self.client.get('/api/admin-api/overview/')
        self.assertEqual(response.status_code, 403)

    def test_admin_allowed_on_admin_overview(self):
        """Admin accessing /api/admin-api/overview/ must succeed with 200 OK."""
        self.client.force_login(self.admin)
        response = self.client.get('/api/admin-api/overview/')
        self.assertEqual(response.status_code, 200)

    def test_admin_allowed_on_teacher_overview(self):
        """Admin has full privileges and can view teacher overview."""
        self.client.force_login(self.admin)
        response = self.client.get('/api/teacher/overview/')
        self.assertEqual(response.status_code, 200)
