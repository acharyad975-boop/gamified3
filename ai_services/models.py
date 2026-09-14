"""AI Code Analysis model."""
from django.db import models


class CodeAnalysis(models.Model):
    """AI-generated code quality analysis for a submission."""
    submission = models.OneToOneField('coding.Submission', on_delete=models.CASCADE, related_name='analysis')
    correctness_score = models.IntegerField(default=0)   # /40
    quality_score = models.IntegerField(default=0)       # /20
    readability_score = models.IntegerField(default=0)   # /15
    efficiency_score = models.IntegerField(default=0)    # /15
    best_practices_score = models.IntegerField(default=0) # /10
    total_score = models.IntegerField(default=0)          # /100
    time_complexity = models.CharField(max_length=50, blank=True)
    space_complexity = models.CharField(max_length=50, blank=True)
    feedback = models.TextField(blank=True)
    suggestions = models.TextField(blank=True)
    explanation = models.TextField(blank=True)  # line-by-line explanation
    optimized_code = models.TextField(blank=True)
    optimization_notes = models.TextField(blank=True)
    original_complexity = models.CharField(max_length=50, blank=True)
    optimized_complexity = models.CharField(max_length=50, blank=True)
    ai_provider = models.CharField(max_length=20, default='heuristic')  # 'openai', 'google', 'heuristic'
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'code_analyses'

    def __str__(self):
        return f"Analysis for submission #{self.submission_id}"
