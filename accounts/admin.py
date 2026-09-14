"""Admin registrations for accounts app."""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, EmailVerification, StudentProfile, TeacherProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_email_verified', 'is_active', 'date_joined']
    list_filter = ['role', 'is_email_verified', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Gamification', {'fields': ('role', 'is_email_verified')}),
    )

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_xp', 'current_level', 'challenges_completed', 'quizzes_completed', 'current_streak']
    list_filter = ['current_level']
    search_fields = ['user__username', 'user__email']

@admin.register(TeacherProfile)
class TeacherProfileAdmin(admin.ModelAdmin):
    list_display = ['user']

@admin.register(EmailVerification)
class EmailVerificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'expires_at', 'is_used']
    list_filter = ['is_used']
