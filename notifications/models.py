"""Notification model."""
from django.db import models
from django.conf import settings


class Notification(models.Model):
    """In-app notification for students."""

    class NotificationType(models.TextChoices):
        XP_EARNED = 'XP_EARNED', 'XP Earned'
        ACHIEVEMENT = 'ACHIEVEMENT', 'Achievement Unlocked'
        LEVEL_UP = 'LEVEL_UP', 'Level Up'
        COMPETITION = 'COMPETITION', 'Competition'
        NEW_CHALLENGE = 'NEW_CHALLENGE', 'New Challenge'
        RANK_CHANGE = 'RANK_CHANGE', 'Rank Changed'
        AI_ANALYSIS = 'AI_ANALYSIS', 'AI Analysis Ready'
        TEACHER_FEEDBACK = 'TEACHER_FEEDBACK', 'Teacher Feedback'
        SYSTEM = 'SYSTEM', 'System'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NotificationType.choices, default=NotificationType.SYSTEM)
    icon = models.CharField(max_length=50, default='🔔')
    is_read = models.BooleanField(default=False)
    url = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [models.Index(fields=['user', 'is_read', '-created_at'])]

    def __str__(self):
        return f"{self.user.username}: {self.title}"
