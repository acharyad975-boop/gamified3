"""Custom user model and profile models."""
import uuid
from datetime import timedelta
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """Extended user model with roles and email verification."""

    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        TEACHER = 'TEACHER', 'Teacher'
        STUDENT = 'STUDENT', 'Student'

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.STUDENT)
    is_email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
        ]

    def __str__(self):
        return f"{self.get_full_name()} ({self.username})"

    @property
    def is_student(self):
        return self.role == self.Role.STUDENT

    @property
    def is_teacher(self):
        return self.role == self.Role.TEACHER

    @property
    def is_admin_user(self):
        return self.role == self.Role.ADMIN or self.is_superuser


class EmailVerification(models.Model):
    """Secure email verification token."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='email_verifications')
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    class Meta:
        db_table = 'email_verifications'

    def save(self, *args, **kwargs):
        if not self.pk:
            from django.conf import settings
            hours = getattr(settings, 'EMAIL_VERIFICATION_EXPIRY_HOURS', 24)
            self.expires_at = timezone.now() + timedelta(hours=hours)
        super().save(*args, **kwargs)

    @property
    def is_valid(self):
        return not self.is_used and timezone.now() < self.expires_at

    def __str__(self):
        return f"Verification for {self.user.email}"


class EmailOTP(models.Model):
    """Secure Email OTP for user registration and verification."""
    email = models.EmailField(db_index=True)
    otp_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    attempts = models.PositiveIntegerField(default=0)
    max_attempts = models.PositiveIntegerField(default=5)
    is_verified = models.BooleanField(default=False)
    is_used = models.BooleanField(default=False)
    session_token = models.CharField(max_length=64, blank=True, null=True, unique=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        db_table = 'email_otps'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email', 'is_verified', 'is_used']),
            models.Index(fields=['session_token']),
        ]

    def __str__(self):
        return f"OTP for {self.email} ({'Verified' if self.is_verified else 'Pending'})"

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    @property
    def remaining_attempts(self):
        return max(0, self.max_attempts - self.attempts)

    def can_resend(self, cooldown_seconds=60):
        """Check if enough time has passed since OTP generation to allow resend."""
        cooldown_delta = timedelta(seconds=cooldown_seconds)
        return timezone.now() >= (self.created_at + cooldown_delta)

    def seconds_until_resend(self, cooldown_seconds=60):
        """Returns remaining seconds before user can request resend."""
        cooldown_delta = timedelta(seconds=cooldown_seconds)
        unlock_time = self.created_at + cooldown_delta
        remaining = (unlock_time - timezone.now()).total_seconds()
        return max(0, int(remaining))



class StudentProfile(models.Model):
    """Extended profile for students."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    date_of_birth = models.DateField(null=True, blank=True)
    school_class = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/students/', null=True, blank=True)
    total_xp = models.IntegerField(default=0)
    current_level = models.IntegerField(default=1)
    coding_score = models.FloatField(default=0.0)
    quiz_score = models.FloatField(default=0.0)
    code_quality_avg = models.FloatField(default=0.0)
    challenges_completed = models.IntegerField(default=0)
    quizzes_completed = models.IntegerField(default=0)
    lessons_completed = models.IntegerField(default=0)
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    last_activity_date = models.DateField(null=True, blank=True)
    theme_preference = models.CharField(max_length=10, default='dark', choices=[('dark', 'Dark'), ('light', 'Light')])
    educational_year = models.CharField(max_length=50, blank=True, default='Year 1')
    current_semester = models.CharField(max_length=50, blank=True, default='Semester 1')
    programming_experience = models.CharField(max_length=50, blank=True, default='Beginner')
    interests = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_profiles'

    def __str__(self):
        return f"Profile of {self.user.username}"

    def get_avatar_url(self):
        if self.avatar:
            return self.avatar.url
        return '/static/images/default-avatar.svg'

    def get_xp_progress(self):
        """Return (current_xp_in_level, xp_needed_for_next, percentage)."""
        from django.conf import settings
        levels = settings.XP_LEVELS
        current_threshold = 0
        next_threshold = None
        for lvl, threshold in levels:
            if lvl == self.current_level:
                current_threshold = threshold
            if lvl == self.current_level + 1:
                next_threshold = threshold
                break
        if next_threshold is None:
            return (self.total_xp - current_threshold, 0, 100)
        xp_in_level = self.total_xp - current_threshold
        xp_needed = next_threshold - current_threshold
        percentage = min(int((xp_in_level / xp_needed) * 100), 100)
        return (xp_in_level, xp_needed, percentage)


class TeacherProfile(models.Model):
    """Extended profile for teachers."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile')
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/teachers/', null=True, blank=True)
    subjects = models.ManyToManyField('subjects.Subject', blank=True, related_name='teachers')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'teacher_profiles'

    def __str__(self):
        return f"Teacher: {self.user.get_full_name()}"

    def get_avatar_url(self):
        if self.avatar:
            return self.avatar.url
        return '/static/images/default-avatar.svg'
