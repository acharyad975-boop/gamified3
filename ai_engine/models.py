"""AI Student Analysis, Profile & Personalized Learning Path Models."""
from django.db import models
from django.conf import settings


class AIStudentProfile(models.Model):
    """Personalized AI profile generated from assessment & continuous learning data."""
    student = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_profile')
    assessment_session = models.ForeignKey('assessments.AssessmentSession', on_delete=models.SET_NULL, null=True, blank=True, related_name='ai_profiles')
    student_summary = models.TextField()
    recommended_starting_subject = models.CharField(max_length=100, default='Python')
    recommended_difficulty = models.CharField(max_length=50, default='Beginner')  # Beginner, Intermediate, Advanced
    
    # Structured JSON fields validated against LLM output schema
    strengths = models.JSONField(default=list)  # [{"subject": "Python", "score": 90, "reason": "..."}]
    improvement_areas = models.JSONField(default=list)  # [{"subject": "Mathematics", "score": 55, "recommendation": "..."}]
    effective_learning_formats = models.JSONField(default=list)  # [{"format": "practical_coding", "effectiveness_score": 92}]
    programming_readiness_score = models.FloatField(default=0.0)
    problem_solving_score = models.FloatField(default=0.0)
    interest_areas = models.JSONField(default=list)  # ["Web Development", "AI/ML"]
    recommendations = models.JSONField(default=list)  # List of string recommendations
    recommended_path = models.JSONField(default=list)  # Approved sequence of subjects/topics
    
    # Technical AI metadata
    raw_llm_response = models.JSONField(default=dict, blank=True)
    ai_provider = models.CharField(max_length=50, default='openai')  # openai, gemini, etc.
    model_version = models.CharField(max_length=50, default='gpt-4o-mini')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ai_student_profiles'
        ordering = ['-updated_at']

    def __str__(self):
        return f"AI Profile for {self.student.username} ({self.recommended_starting_subject})"


class PersonalizedLearningPath(models.Model):
    """Active customized curriculum path generated for a student."""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='learning_paths')
    title = models.CharField(max_length=200, default='Personalized Computer Science Path')
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    progress_percentage = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'personalized_learning_paths'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.username} - {self.title} ({self.progress_percentage:.1f}%)"


class LearningPathItem(models.Model):
    """An individual curriculum step inside a student's personalized path."""
    path = models.ForeignKey(PersonalizedLearningPath, on_delete=models.CASCADE, related_name='items')
    subject = models.ForeignKey('subjects.Subject', on_delete=models.CASCADE)
    level = models.ForeignKey('curriculum.Level', on_delete=models.SET_NULL, null=True, blank=True)
    chapter = models.ForeignKey('curriculum.Chapter', on_delete=models.SET_NULL, null=True, blank=True)
    lesson = models.ForeignKey('curriculum.Lesson', on_delete=models.SET_NULL, null=True, blank=True)
    coding_challenge = models.ForeignKey('coding.CodingChallenge', on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=200)
    order = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    is_unlocked = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'learning_path_items'
        ordering = ['path', 'order']

    def __str__(self):
        return f"[{self.order}] {self.path.student.username}: {self.title}"


class AIRecommendation(models.Model):
    """Continuous adaptive recommendation update from dynamic performance evaluations."""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_recommendations')
    title = models.CharField(max_length=200)
    reason = models.TextField()
    suggested_changes = models.JSONField(default=dict)  # changes to learning path or focus
    is_applied = models.BooleanField(default=False)
    is_dismissed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ai_recommendations'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student.username} - {self.title} ({'Applied' if self.is_applied else 'Pending'})"
