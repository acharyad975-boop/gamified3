from django.contrib import admin
from .models import Level, Lesson, LearningProgress, Quiz, Question, QuizAttempt, QuizAnswer

@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ['subject', 'number', 'title', 'is_active']
    list_filter = ['subject', 'is_active']

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'level', 'xp_reward', 'order', 'is_active']
    list_filter = ['level__subject', 'is_active']
    search_fields = ['title']

class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'difficulty', 'xp_reward', 'time_limit_minutes', 'is_active']
    list_filter = ['difficulty', 'is_active']
    inlines = [QuestionInline]

@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ['student', 'quiz', 'score', 'percentage', 'is_completed', 'started_at']
    list_filter = ['is_completed']
