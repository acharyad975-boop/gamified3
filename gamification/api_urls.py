"""API URL configuration for Code Logic Games."""
from django.urls import path
from . import game_views

urlpatterns = [
    path('hub/', game_views.GameHubView.as_view(), name='game-hub'),
    path('daily/', game_views.DailyChallengeView.as_view(), name='game-daily-challenge'),
    path('leaderboard/', game_views.GameLeaderboardView.as_view(), name='game-leaderboard'),
    path('session/complete/', game_views.GameSessionCompleteView.as_view(), name='game-session-complete'),
    path('teacher-analytics/', game_views.TeacherGameAnalyticsView.as_view(), name='game-teacher-analytics'),
    path('admin/manage/', game_views.AdminGameManageView.as_view(), name='game-admin-manage'),
    path('<slug:slug>/', game_views.GameDetailView.as_view(), name='game-detail'),
]
