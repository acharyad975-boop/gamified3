"""Curriculum models: Subjects, Modules, Chapters, Topics, Lessons, Quizzes, Questions."""
from django.db import models
from django.conf import settings


class Level(models.Model):
    """A learning level within a subject (kept for backwards compatibility)."""
    subject = models.ForeignKey('subjects.Subject', on_delete=models.CASCADE, related_name='levels')
    number = models.IntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    xp_to_unlock = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'levels'
        unique_together = [('subject', 'number')]
        ordering = ['subject', 'number']

    def __str__(self):
        return f"{self.subject.name} - Level {self.number}: {self.title}"


class Module(models.Model):
    """A high-level module within a Subject (e.g. Module 1: Python Fundamentals)."""
    subject = models.ForeignKey('subjects.Subject', on_delete=models.CASCADE, related_name='modules')
    number = models.IntegerField(default=1)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'curriculum_modules'
        ordering = ['subject', 'order', 'number']

    def __str__(self):
        return f"{self.subject.name} > Module {self.number}: {self.title}"


class Chapter(models.Model):
    """A chapter within a module or level."""
    level = models.ForeignKey(Level, on_delete=models.CASCADE, null=True, blank=True, related_name='chapters')
    module = models.ForeignKey(Module, on_delete=models.CASCADE, null=True, blank=True, related_name='chapters')
    number = models.IntegerField(default=1)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chapters'
        ordering = ['order', 'number']

    def __str__(self):
        parent_name = self.module.title if self.module else (self.level.title if self.level else "Chapter")
        return f"{parent_name} > Ch.{self.number}: {self.title}"


class Lesson(models.Model):
    """A multimodal lesson / topic within a chapter."""
    level = models.ForeignKey(Level, on_delete=models.CASCADE, null=True, blank=True, related_name='lessons')
    chapter = models.ForeignKey(Chapter, on_delete=models.SET_NULL, null=True, blank=True, related_name='lessons')
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    # Multimodal Content Layers
    content = models.TextField()  # Text / Markdown / HTML explanation
    visual_diagram_desc = models.TextField(blank=True)  # Visual diagram description / ASCII / SVG / flowchart
    code_example = models.TextField(blank=True)
    code_language = models.CharField(max_length=50, default='python')
    audio_transcript = models.TextField(blank=True)  # Spoken narration script
    
    # Interactive Animation Metadata
    animation_type = models.CharField(max_length=50, default='none')  # python_loop, variable, stack, queue, sorting, sql_query, react_state, binary_search, neural_network
    animation_config = models.JSONField(default=dict, blank=True)
    
    # Educational Metrics
    difficulty = models.CharField(max_length=20, default='Beginner')  # Beginner, Intermediate, Advanced
    xp_reward = models.IntegerField(default=50)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'lessons'
        ordering = ['chapter', 'order']

    def __str__(self):
        return f"{self.chapter.title if self.chapter else 'Lesson'} > {self.title}"


class LearningProgress(models.Model):
    """Tracks a student's progress through lessons."""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='learning_progress')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='progress')
    is_started = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)
    time_spent_seconds = models.IntegerField(default=0)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'learning_progress'
        unique_together = [('student', 'lesson')]

    def __str__(self):
        return f"{self.student.username} - {self.lesson.title}"


class Quiz(models.Model):
    """A quiz associated with a lesson or chapter."""

    class Difficulty(models.TextChoices):
        BEGINNER = 'BEGINNER', 'Beginner'
        INTERMEDIATE = 'INTERMEDIATE', 'Intermediate'
        ADVANCED = 'ADVANCED', 'Advanced'

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='quizzes', null=True, blank=True)
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='quizzes', null=True, blank=True)
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='quizzes', null=True, blank=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    difficulty = models.CharField(max_length=20, choices=Difficulty.choices, default=Difficulty.BEGINNER)
    xp_reward = models.IntegerField(default=100)
    time_limit_minutes = models.IntegerField(default=10)
    passing_score = models.IntegerField(default=70)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'quizzes'

    def __str__(self):
        return self.title

    def get_question_count(self):
        return self.questions.count()


class Question(models.Model):
    """A question within a quiz."""

    class QuestionType(models.TextChoices):
        MCQ = 'MCQ', 'Multiple Choice'
        TRUE_FALSE = 'TF', 'True/False'
        CODE_OUTPUT = 'CODE_OUTPUT', 'Code Output'
        DEBUGGING = 'DEBUGGING', 'Debugging'

    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QuestionType.choices, default=QuestionType.MCQ)
    code_snippet = models.TextField(blank=True)
    option_a = models.TextField(blank=True)
    option_b = models.TextField(blank=True)
    option_c = models.TextField(blank=True)
    option_d = models.TextField(blank=True)
    correct_answer = models.CharField(max_length=10)
    explanation = models.TextField(blank=True)
    points = models.IntegerField(default=10)
    order = models.IntegerField(default=0)

    class Meta:
        db_table = 'questions'
        ordering = ['quiz', 'order']

    def __str__(self):
        return f"Q{self.order}: {self.text[:60]}"

    def get_options(self):
        if self.question_type == self.QuestionType.TRUE_FALSE:
            return [('True', 'True'), ('False', 'False')]
        options = []
        for key, val in [('A', self.option_a), ('B', self.option_b), ('C', self.option_c), ('D', self.option_d)]:
            if val:
                options.append((key, val))
        return options


class QuizAttempt(models.Model):
    """A student's attempt at a quiz."""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='quiz_attempts')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    score = models.IntegerField(default=0)
    max_score = models.IntegerField(default=0)
    xp_earned = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'quiz_attempts'
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.student.username} - {self.quiz.title}"

    @property
    def percentage(self):
        if self.max_score == 0:
            return 0
        return int((self.score / self.max_score) * 100)

    @property
    def passed(self):
        return self.percentage >= self.quiz.passing_score


class QuizAnswer(models.Model):
    """Individual answer within a quiz attempt."""
    attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_answer = models.CharField(max_length=10)
    is_correct = models.BooleanField(default=False)
    points_earned = models.IntegerField(default=0)

    class Meta:
        db_table = 'quiz_answers'
        unique_together = [('attempt', 'question')]
