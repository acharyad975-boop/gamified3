"""Teacher Management Models: Classrooms, Assignments, Submissions, Feedback, Notifications."""
from django.db import models
from django.conf import settings
from subjects.models import Subject
from curriculum.models import Lesson, Chapter, Quiz
from coding.models import CodingChallenge


class Classroom(models.Model):
    """A classroom / cohort managed by a teacher."""
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='managed_classes')
    name = models.CharField(max_length=200)  # e.g., "BSc Computer Science - Year 1"
    section = models.CharField(max_length=50, blank=True)
    academic_year = models.CharField(max_length=50, default='Year 1')
    description = models.TextField(blank=True)
    subjects = models.ManyToManyField(Subject, blank=True, related_name='classrooms')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'classrooms'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.academic_year})"

    @property
    def student_count(self):
        return self.enrollments.count()


class ClassroomEnrollment(models.Model):
    """Student enrollment in a classroom."""
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='enrollments')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='class_enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'classroom_enrollments'
        unique_together = [('classroom', 'student')]

    def __str__(self):
        return f"{self.student.username} in {self.classroom.name}"


class TeacherAssignment(models.Model):
    """An assignment created by a teacher for a class or specific students."""

    class AssignmentType(models.TextChoices):
        LESSON = 'LESSON', 'Lesson Study'
        CHAPTER = 'CHAPTER', 'Chapter Module'
        QUIZ = 'QUIZ', 'Diagnostic Quiz'
        CODING = 'CODING', 'Coding Challenge'
        PRACTICE = 'PRACTICE', 'Practice Exercise'

    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_assignments')
    classroom = models.ForeignKey(Classroom, on_delete=models.SET_NULL, null=True, blank=True, related_name='assignments')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    assignment_type = models.CharField(max_length=30, choices=AssignmentType.choices, default=AssignmentType.LESSON)
    
    # Target item links
    subject = models.ForeignKey(Subject, on_delete=models.SET_NULL, null=True, blank=True)
    chapter = models.ForeignKey(Chapter, on_delete=models.SET_NULL, null=True, blank=True)
    lesson = models.ForeignKey(Lesson, on_delete=models.SET_NULL, null=True, blank=True)
    quiz = models.ForeignKey(Quiz, on_delete=models.SET_NULL, null=True, blank=True)
    coding_challenge = models.ForeignKey(CodingChallenge, on_delete=models.SET_NULL, null=True, blank=True)
    
    xp_reward = models.IntegerField(default=100)
    due_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'teacher_assignments'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.assignment_type})"


class AssignmentSubmission(models.Model):
    """A student's submission / completion record for an assignment."""

    class Status(models.TextChoices):
        ASSIGNED = 'ASSIGNED', 'Assigned'
        COMPLETED = 'COMPLETED', 'Completed'
        PENDING = 'PENDING', 'Pending'
        LATE = 'LATE', 'Late'

    assignment = models.ForeignKey(TeacherAssignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assignment_submissions')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ASSIGNED)
    score_percentage = models.FloatField(default=0.0)
    notes = models.TextField(blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'assignment_submissions'
        unique_together = [('assignment', 'student')]
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.student.username} - {self.assignment.title} ({self.status})"


class TeacherFeedback(models.Model):
    """Personalized feedback sent from teacher to student."""
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_feedback')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_teacher_feedback')
    title = models.CharField(max_length=200)
    message = models.TextField()
    recommended_chapter = models.ForeignKey(Chapter, on_delete=models.SET_NULL, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'teacher_feedback'
        ordering = ['-created_at']

    def __str__(self):
        return f"Feedback to {self.student.username}: {self.title}"


class TeacherNotification(models.Model):
    """Real-time notifications for teacher."""
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='teacher_notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, default='submission')  # submission, attention, join, alert
    link = models.CharField(max_length=255, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'teacher_notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"Teacher Notification: {self.title}"
