"""Progress Tracking Models for overall student dashboard."""
from django.db import models
from django.conf import settings


class StudentProgressOverview(models.Model):
    """Aggregate progress overview for fast dashboard queries."""
    student = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='progress_overview')
    current_subject = models.ForeignKey('subjects.Subject', on_delete=models.SET_NULL, null=True, blank=True)
    current_chapter = models.ForeignKey('curriculum.Chapter', on_delete=models.SET_NULL, null=True, blank=True)
    current_lesson = models.ForeignKey('curriculum.Lesson', on_delete=models.SET_NULL, null=True, blank=True)
    total_study_minutes = models.IntegerField(default=0)
    completion_percentage = models.FloatField(default=0.0)
    last_active_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_progress_overviews'

    def __str__(self):
        return f"Progress Overview: {self.student.username}"
