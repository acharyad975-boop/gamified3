from django.contrib import admin
from .models import Achievement, StudentAchievement, Reward, RewardPurchase, XPTransaction

@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'condition_type', 'condition_value', 'xp_reward', 'is_active']

@admin.register(StudentAchievement)
class StudentAchievementAdmin(admin.ModelAdmin):
    list_display = ['student', 'achievement', 'unlocked_at']

@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ['name', 'reward_type', 'xp_cost', 'is_active']

@admin.register(XPTransaction)
class XPTransactionAdmin(admin.ModelAdmin):
    list_display = ['student', 'amount', 'source', 'description', 'created_at']
    list_filter = ['source']
