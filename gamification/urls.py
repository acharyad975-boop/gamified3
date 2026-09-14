"""Gamification URL configuration."""
from django.urls import path
from . import views

urlpatterns = [
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    path('achievements/', views.achievements, name='achievements'),
    path('rewards/', views.rewards_store, name='rewards_store'),
    path('rewards/<int:reward_id>/purchase/', views.purchase_reward, name='purchase_reward'),
    path('xp-history/', views.xp_history, name='xp_history'),
]
