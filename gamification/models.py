"""Gamification models: XP, Achievements, Rewards, Leaderboard."""
from django.db import models
from django.conf import settings


class XPTransaction(models.Model):
    """Records every XP change for a student."""

    class Source(models.TextChoices):
        LESSON = 'LESSON', 'Lesson Completed'
        QUIZ = 'QUIZ', 'Quiz Passed'
        CHALLENGE = 'CHALLENGE', 'Coding Challenge'
        COMPETITION = 'COMPETITION', 'Competition'
        ACHIEVEMENT = 'ACHIEVEMENT', 'Achievement Unlocked'
        STREAK = 'STREAK', 'Daily Streak'
        CODE_QUALITY = 'CODE_QUALITY', 'High Code Quality'
        REWARD_SPENT = 'REWARD_SPENT', 'Reward Purchase'
        MANUAL = 'MANUAL', 'Manual Award'
        GAME = 'GAME', 'Code Logic Game'

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='xp_transactions')
    amount = models.IntegerField()  # positive = earned, negative = spent
    source = models.CharField(max_length=20, choices=Source.choices)
    description = models.CharField(max_length=255)
    reference_id = models.IntegerField(null=True, blank=True)  # ID of the related object
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'xp_transactions'
        ordering = ['-created_at']
        indexes = [models.Index(fields=['student', '-created_at'])]

    def __str__(self):
        sign = '+' if self.amount > 0 else ''
        return f"{sign}{self.amount} XP - {self.student.username} ({self.source})"


class Achievement(models.Model):
    """An achievement definition."""

    class ConditionType(models.TextChoices):
        TOTAL_XP = 'TOTAL_XP', 'Total XP Reached'
        CHALLENGES_COMPLETED = 'CHALLENGES_COMPLETED', 'Challenges Completed'
        QUIZZES_COMPLETED = 'QUIZZES_COMPLETED', 'Quizzes Completed'
        LESSONS_COMPLETED = 'LESSONS_COMPLETED', 'Lessons Completed'
        STREAK_DAYS = 'STREAK_DAYS', 'Day Streak'
        PERFECT_QUIZ = 'PERFECT_QUIZ', 'Perfect Quiz Score'
        COMPETITION_WIN = 'COMPETITION_WIN', 'Competition Win'
        CODE_QUALITY = 'CODE_QUALITY', 'Code Quality Score'
        FIRST_SUBMISSION = 'FIRST_SUBMISSION', 'First Submission'
        FIRST_QUIZ = 'FIRST_QUIZ', 'First Quiz'
        GAMES_COMPLETED = 'GAMES_COMPLETED', 'Games Completed'
        GAME_PERFECT = 'GAME_PERFECT', 'Perfect Game Solution'
        NO_HINT_GAMES = 'NO_HINT_GAMES', 'Games Without Hints'

    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='🏆')
    badge_color = models.CharField(max_length=20, default='#FFD700')
    condition_type = models.CharField(max_length=30, choices=ConditionType.choices)
    condition_value = models.IntegerField(default=1)
    xp_reward = models.IntegerField(default=50)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'achievements'

    def __str__(self):
        return self.name


class StudentAchievement(models.Model):
    """Records when a student unlocks an achievement."""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name='student_achievements')
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'student_achievements'
        unique_together = [('student', 'achievement')]
        ordering = ['-unlocked_at']

    def __str__(self):
        return f"{self.student.username} - {self.achievement.name}"


class Reward(models.Model):
    """A reward available in the XP reward store."""

    class RewardType(models.TextChoices):
        HINT = 'HINT', 'Extra Hint'
        EXTRA_ATTEMPT = 'EXTRA_ATTEMPT', 'Extra Attempt'
        SPECIAL_CHALLENGE = 'SPECIAL_CHALLENGE', 'Special Challenge'
        AVATAR_ITEM = 'AVATAR_ITEM', 'Avatar Item'
        BADGE = 'BADGE', 'Special Badge'
        THEME = 'THEME', 'Theme Unlock'

    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='🎁')
    reward_type = models.CharField(max_length=20, choices=RewardType.choices)
    xp_cost = models.IntegerField()
    stock = models.IntegerField(null=True, blank=True)  # None = unlimited
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'rewards'
        ordering = ['xp_cost']

    def __str__(self):
        return f"{self.name} ({self.xp_cost} XP)"


class RewardPurchase(models.Model):
    """Records a student purchasing a reward."""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reward_purchases')
    reward = models.ForeignKey(Reward, on_delete=models.CASCADE, related_name='purchases')
    xp_spent = models.IntegerField()
    purchased_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reward_purchases'
        ordering = ['-purchased_at']

    def __str__(self):
        return f"{self.student.username} - {self.reward.name}"


# ============================================================
# CODE LOGIC GAMES DATA MODELS
# ============================================================

class GameDefinition(models.Model):
    """Catalog of all Code Logic Lab games."""

    class Category(models.TextChoices):
        LOGIC = 'LOGIC', 'Core Logic & Sequencing'
        CONTROL_FLOW = 'CONTROL_FLOW', 'Control Flow & Loops'
        STATE = 'STATE', 'Variables & State'
        MODULARITY = 'MODULARITY', 'Functions & Modularity'
        DATA_STRUCTURES = 'DATA_STRUCTURES', 'Data Structures & Collections'
        ALGORITHMS = 'ALGORITHMS', 'Algorithms & Optimization'
        DEBUGGING = 'DEBUGGING', 'Debugging & Analysis'

    title = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=100)
    category = models.CharField(max_length=30, choices=Category.choices, default=Category.LOGIC)
    concept = models.CharField(max_length=150)
    tagline = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='🎮')
    badge_color = models.CharField(max_length=30, default='#6366f1')
    gradient = models.CharField(max_length=100, default='linear-gradient(135deg, #6366f1, #8b5cf6)')
    languages_supported = models.JSONField(default=list)  # ["python", "javascript", "java", "cpp"]
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'game_definitions'
        ordering = ['order', 'title']

    def __str__(self):
        return f"{self.icon} {self.title} ({self.concept})"


class GameLevel(models.Model):
    """Individual level/stage inside a game (5 standard difficulty tiers)."""

    class Difficulty(models.TextChoices):
        BEGINNER = 'BEGINNER', 'Beginner'
        EASY = 'EASY', 'Easy'
        MEDIUM = 'MEDIUM', 'Medium'
        HARD = 'HARD', 'Hard'
        EXPERT = 'EXPERT', 'Expert'

    game = models.ForeignKey(GameDefinition, on_delete=models.CASCADE, related_name='levels')
    level_number = models.IntegerField(default=1)
    difficulty = models.CharField(max_length=20, choices=Difficulty.choices, default=Difficulty.BEGINNER)
    title = models.CharField(max_length=150)
    objective = models.TextField()
    instructions = models.TextField()
    initial_state = models.JSONField(default=dict)  # Grid, items, memory state, initial board
    solution_criteria = models.JSONField(default=dict)  # Target coordinates, expected return, sorted state
    hints = models.JSONField(default=list)  # ["Step 1 hint", "Step 2 hint"]
    code_snippets = models.JSONField(default=dict)  # {"python": "...", "javascript": "...", "cpp": "..."}
    xp_reward = models.IntegerField(default=50)
    perfect_bonus_xp = models.IntegerField(default=25)
    no_hint_bonus_xp = models.IntegerField(default=20)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'game_levels'
        ordering = ['game', 'level_number']
        unique_together = [('game', 'level_number')]

    def __str__(self):
        return f"{self.game.title} - Level {self.level_number}: {self.title} ({self.difficulty})"


class GameSession(models.Model):
    """Records each game playthrough session by a student for AI analysis and telemetry."""

    class Status(models.TextChoices):
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED', 'Completed Successfully'
        FAILED = 'FAILED', 'Failed'
        ABANDONED = 'ABANDONED', 'Abandoned'

    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='game_sessions')
    game = models.ForeignKey(GameDefinition, on_delete=models.CASCADE, related_name='sessions')
    level = models.ForeignKey(GameLevel, on_delete=models.SET_NULL, null=True, blank=True, related_name='sessions')
    difficulty = models.CharField(max_length=20, default='BEGINNER')
    language_mode = models.CharField(max_length=30, default='python')
    
    # Gameplay telemetry
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.IN_PROGRESS)
    attempts = models.IntegerField(default=1)
    mistakes_count = models.IntegerField(default=0)
    hints_used = models.IntegerField(default=0)
    time_taken_seconds = models.IntegerField(default=0)
    accuracy_percentage = models.FloatField(default=100.0)
    steps_executed = models.IntegerField(default=0)
    optimal_steps = models.IntegerField(default=0)
    efficiency_score = models.FloatField(default=100.0)
    
    # Outcomes & Rewards
    score = models.IntegerField(default=0)
    xp_earned = models.IntegerField(default=0)
    is_perfect = models.BooleanField(default=False)
    concepts_tested = models.JSONField(default=list)  # ["loops", "accumulator", "range"]
    mistake_log = models.JSONField(default=list)  # [{"step": 2, "error": "off_by_one", "detail": "..."}]
    
    # AI Analysis & Adaptation
    ai_feedback = models.TextField(blank=True)
    ai_recommended_difficulty = models.CharField(max_length=20, default='BEGINNER')
    ai_recommended_actions = models.JSONField(default=list)  # ["View Animation", "Try Easy Drill"]
    
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'game_sessions'
        ordering = ['-started_at']
        indexes = [
            models.Index(fields=['student', 'game', '-started_at']),
            models.Index(fields=['status', '-started_at']),
        ]

    def __str__(self):
        return f"{self.student.username} - {self.game.title} (Lvl {self.level.level_number if self.level else '?'}) [{self.status}]"


class DailyCodeChallenge(models.Model):
    """Daily rotating code logic puzzle for all students."""
    date = models.DateField(unique=True)
    title = models.CharField(max_length=150)
    description = models.TextField()
    game = models.ForeignKey(GameDefinition, on_delete=models.CASCADE, related_name='daily_challenges')
    level_config = models.JSONField(default=dict)
    target_concept = models.CharField(max_length=100, default='Logic & Control Flow')
    difficulty = models.CharField(max_length=20, default='Medium')
    xp_reward = models.IntegerField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'daily_code_challenges'
        ordering = ['-date']

    def __str__(self):
        return f"Daily Challenge ({self.date}): {self.title}"


class DailyChallengeCompletion(models.Model):
    """Records completion of a daily challenge by a student."""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='daily_completions')
    challenge = models.ForeignKey(DailyCodeChallenge, on_delete=models.CASCADE, related_name='completions')
    completed_at = models.DateTimeField(auto_now_add=True)
    xp_awarded = models.IntegerField(default=100)
    time_taken_seconds = models.IntegerField(default=0)

    class Meta:
        db_table = 'daily_challenge_completions'
        unique_together = [('student', 'challenge')]

    def __str__(self):
        return f"{self.student.username} - {self.challenge.date}"


class StudentGameStats(models.Model):
    """Aggregated game progress metrics per student per game."""
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='game_stats')
    game = models.ForeignKey(GameDefinition, on_delete=models.CASCADE, related_name='student_stats')
    highest_level_unlocked = models.IntegerField(default=1)
    levels_completed_count = models.IntegerField(default=0)
    total_play_time_seconds = models.IntegerField(default=0)
    total_xp_earned = models.IntegerField(default=0)
    total_attempts = models.IntegerField(default=0)
    total_mistakes = models.IntegerField(default=0)
    average_accuracy = models.FloatField(default=100.0)
    adaptive_difficulty = models.CharField(max_length=20, default='BEGINNER')
    weak_concepts = models.JSONField(default=list)  # ["nested_loops", "off_by_one"]
    mastered_concepts = models.JSONField(default=list)  # ["for_range", "sequence"]
    last_played_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_game_stats'
        unique_together = [('student', 'game')]

    def __str__(self):
        return f"{self.student.username} - {self.game.title} (Lvl {self.highest_level_unlocked})"

