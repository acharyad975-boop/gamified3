from django.contrib import admin
from .models import CodingChallenge, TestCase, Submission, CodeExecution

class TestCaseInline(admin.TabularInline):
    model = TestCase
    extra = 2

@admin.register(CodingChallenge)
class CodingChallengeAdmin(admin.ModelAdmin):
    list_display = ['title', 'subject', 'difficulty', 'xp_reward', 'is_active']
    list_filter = ['difficulty', 'subject', 'is_active']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [TestCaseInline]

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ['student', 'challenge', 'language', 'status', 'submitted_at']
    list_filter = ['status', 'language']
