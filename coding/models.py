"""Coding challenge, test case, submission, and execution models."""
from django.db import models
from django.conf import settings


class CodingChallenge(models.Model):
    """A programming coding challenge."""

    class Difficulty(models.TextChoices):
        EASY = 'EASY', 'Easy'
        MEDIUM = 'MEDIUM', 'Medium'
        HARD = 'HARD', 'Hard'

    subject = models.ForeignKey('subjects.Subject', on_delete=models.CASCADE, related_name='challenges')
    language = models.ForeignKey('subjects.ProgrammingLanguage', on_delete=models.SET_NULL, null=True, blank=True, related_name='challenges')
    level = models.ForeignKey('curriculum.Level', on_delete=models.SET_NULL, null=True, blank=True, related_name='challenges')
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    input_format = models.TextField(blank=True)
    output_format = models.TextField(blank=True)
    constraints = models.TextField(blank=True)
    examples = models.TextField(blank=True)
    hints = models.TextField(blank=True)
    difficulty = models.CharField(max_length=10, choices=Difficulty.choices, default=Difficulty.EASY)
    xp_reward = models.IntegerField(default=100)
    time_limit_seconds = models.IntegerField(default=10)
    memory_limit_mb = models.IntegerField(default=128)
    starter_code = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_challenges')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'coding_challenges'
        ordering = ['difficulty', 'title']

    def __str__(self):
        return self.title

    def get_accepted_count(self):
        return self.submissions.filter(status='ACCEPTED').values('student').distinct().count()


class TestCase(models.Model):
    """A test case for a coding challenge."""
    challenge = models.ForeignKey(CodingChallenge, on_delete=models.CASCADE, related_name='test_cases')
    input_data = models.TextField(blank=True)
    expected_output = models.TextField()
    is_hidden = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    class Meta:
        db_table = 'test_cases'
        ordering = ['challenge', 'order']

    def __str__(self):
        return f"Test #{self.order} for {self.challenge.title}"


class Submission(models.Model):
    """A code submission by a student."""

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        WRONG_ANSWER = 'WRONG_ANSWER', 'Wrong Answer'
        COMPILATION_ERROR = 'COMPILATION_ERROR', 'Compilation Error'
        RUNTIME_ERROR = 'RUNTIME_ERROR', 'Runtime Error'
        TIME_LIMIT_EXCEEDED = 'TLE', 'Time Limit Exceeded'
        MEMORY_LIMIT_EXCEEDED = 'MLE', 'Memory Limit Exceeded'
        INTERNAL_ERROR = 'INTERNAL_ERROR', 'Internal Error'

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='submissions')
    challenge = models.ForeignKey(CodingChallenge, on_delete=models.CASCADE, related_name='submissions')
    language = models.ForeignKey('subjects.ProgrammingLanguage', on_delete=models.SET_NULL, null=True)
    source_code = models.TextField()
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING)
    passed_tests = models.IntegerField(default=0)
    total_tests = models.IntegerField(default=0)
    xp_earned = models.IntegerField(default=0)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'submissions'
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.student.username} - {self.challenge.title} - {self.status}"

    @property
    def pass_rate(self):
        if self.total_tests == 0:
            return 0
        return int((self.passed_tests / self.total_tests) * 100)


class CodeExecution(models.Model):
    """Result of executing code against a test case."""
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='executions')
    test_case = models.ForeignKey(TestCase, on_delete=models.CASCADE)
    stdout = models.TextField(blank=True)
    stderr = models.TextField(blank=True)
    runtime_ms = models.FloatField(default=0)
    memory_kb = models.FloatField(default=0)
    passed = models.BooleanField(default=False)
    executed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'code_executions'
