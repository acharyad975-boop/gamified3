"""7-Day Assessment System Models."""
from django.db import models
from django.conf import settings


class AssessmentSession(models.Model):
    """A student's 7-day onboarding assessment session."""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assessment_sessions')
    current_day = models.IntegerField(default=1)  # 1 through 7
    is_completed = models.BooleanField(default=False)
    overall_score = models.FloatField(default=0.0)
    ai_profile_generated = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'assessment_sessions'
        ordering = ['-started_at']

    def __str__(self):
        status = "Completed" if self.is_completed else f"Day {self.current_day}"
        return f"Assessment for {self.student.username} ({status})"


class AssessmentDay(models.Model):
    """Day-level summary in the 7-day assessment."""
    session = models.ForeignKey(AssessmentSession, on_delete=models.CASCADE, related_name='days')
    day_number = models.IntegerField()  # 1 to 7
    title = models.CharField(max_length=150)
    subtitle = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    is_unlocked = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    score_percentage = models.FloatField(default=0.0)
    total_questions = models.IntegerField(default=0)
    correct_answers = models.IntegerField(default=0)
    time_spent_seconds = models.IntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'assessment_days'
        unique_together = [('session', 'day_number')]
        ordering = ['session', 'day_number']

    def __str__(self):
        return f"Session {self.session.id} - Day {self.day_number}: {self.title}"


class AssessmentQuestion(models.Model):
    """Question item for the 7-day onboarding assessment."""

    class QuestionType(models.TextChoices):
        MCQ = 'MCQ', 'Multiple Choice'
        FORMAT_TEST = 'FORMAT_TEST', 'Content Format Test'
        CODE_SNIPPET = 'CODE_SNIPPET', 'Code Snippet Analysis'
        LOGIC_PUZZLE = 'LOGIC_PUZZLE', 'Logic / Algorithmic Puzzle'
        INTEREST_RATING = 'INTEREST_RATING', 'Interest Self-Report / Mini-Task'

    class ContentFormat(models.TextChoices):
        TEXT = 'text', 'Text Explanation'
        VISUAL = 'visual_diagrams', 'Visual Diagrams'
        INTERACTIVE = 'interactive', 'Interactive Content'
        ANIMATION = 'animation', 'Animation'
        AUDIO = 'audio_explanation', 'Audio Explanation'
        PRACTICAL = 'practical_coding', 'Practical Coding'
        NONE = 'none', 'Standard Assessment'

    day_number = models.IntegerField(db_index=True)  # 1 to 7
    subject_tag = models.CharField(max_length=100, default='General')  # e.g. 'Python', 'Math', 'Web Dev', 'Logic'
    question_type = models.CharField(max_length=30, choices=QuestionType.choices, default=QuestionType.MCQ)
    format_type = models.CharField(max_length=30, choices=ContentFormat.choices, default=ContentFormat.NONE)
    title = models.CharField(max_length=200)
    prompt = models.TextField()
    media_url = models.CharField(max_length=300, blank=True)
    interactive_data = models.JSONField(default=dict, blank=True)  # for interactive simulation/code
    code_snippet = models.TextField(blank=True)
    options = models.JSONField(default=list)  # list of strings: ["Option A", "Option B", ...]
    correct_answer = models.CharField(max_length=255)
    explanation = models.TextField(blank=True)
    points = models.IntegerField(default=10)
    difficulty = models.CharField(max_length=20, default='Beginner')  # Beginner, Intermediate, Advanced
    order = models.IntegerField(default=0)

    class Meta:
        db_table = 'assessment_questions'
        ordering = ['day_number', 'order']

    def __str__(self):
        return f"Day {self.day_number} [Q{self.order}] {self.title}"


class AssessmentAttempt(models.Model):
    """Student's submitted answer for an assessment question."""
    session = models.ForeignKey(AssessmentSession, on_delete=models.CASCADE, related_name='attempts')
    day_number = models.IntegerField()
    question = models.ForeignKey(AssessmentQuestion, on_delete=models.CASCADE, related_name='student_attempts')
    selected_answer = models.TextField()
    is_correct = models.BooleanField(default=False)
    time_spent_seconds = models.IntegerField(default=0)
    attempts_count = models.IntegerField(default=1)
    points_earned = models.IntegerField(default=0)
    self_reported_interest = models.IntegerField(null=True, blank=True)  # 1 to 5 if applicable
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'assessment_attempts'
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.session.student.username} - Day {self.day_number} Q{self.question_id}: {'Correct' if self.is_correct else 'Incorrect'}"


class StudentContentFormatResult(models.Model):
    """Measured effectiveness of various content formats from Day 4 testing."""
    session = models.ForeignKey(AssessmentSession, on_delete=models.CASCADE, related_name='format_results')
    format_type = models.CharField(max_length=30, choices=AssessmentQuestion.ContentFormat.choices)
    accuracy_score = models.FloatField(default=0.0)  # 0 to 100
    engagement_time_seconds = models.IntegerField(default=0)
    retention_score = models.FloatField(default=0.0)
    effectiveness_score = models.FloatField(default=0.0)  # Computed composite metric
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'student_content_format_results'
        unique_together = [('session', 'format_type')]
        ordering = ['-effectiveness_score']

    def __str__(self):
        return f"{self.session.student.username} - {self.format_type}: {self.effectiveness_score}%"
