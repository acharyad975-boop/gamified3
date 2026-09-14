"""Analytics & Performance Tracking Models."""
from django.db import models
from django.conf import settings


class StudentSubjectPerformance(models.Model):
    """Aggregate subject performance metrics for radar and mastery graphs."""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='subject_performances')
    subject = models.ForeignKey('subjects.Subject', on_delete=models.CASCADE)
    mastery_percentage = models.FloatField(default=0.0)  # 0 to 100
    quiz_accuracy = models.FloatField(default=0.0)
    coding_accuracy = models.FloatField(default=0.0)
    total_time_spent_seconds = models.IntegerField(default=0)
    quizzes_taken = models.IntegerField(default=0)
    challenges_solved = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_subject_performances'
        unique_together = [('student', 'subject')]
        ordering = ['-mastery_percentage']

    def __str__(self):
        return f"{self.student.username} - {self.subject.name}: {self.mastery_percentage:.1f}%"


class StudentLearningMetric(models.Model):
    """Daily/periodic learning metrics for progress over time analytics."""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='learning_metrics')
    date = models.DateField(db_index=True)
    study_time_minutes = models.IntegerField(default=0)
    xp_earned = models.IntegerField(default=0)
    lessons_completed = models.IntegerField(default=0)
    quizzes_passed = models.IntegerField(default=0)
    challenges_completed = models.IntegerField(default=0)
    accuracy_rate = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'student_learning_metrics'
        unique_together = [('student', 'date')]
        ordering = ['-date']

    def __str__(self):
        return f"{self.student.username} on {self.date}: {self.xp_earned} XP"
