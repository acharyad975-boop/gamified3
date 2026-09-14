"""Competitions URL configuration."""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.competition_list, name='competition_list'),
    path('<slug:slug>/', views.competition_detail, name='competition_detail'),
    path('<slug:slug>/join/', views.join_competition, name='join_competition'),
    path('<slug:slug>/leaderboard/', views.competition_leaderboard, name='competition_leaderboard'),
]
