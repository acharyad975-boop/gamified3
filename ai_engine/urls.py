"""AI Engine API URL configuration."""
from django.urls import path
from . import views

urlpatterns = [
    path('analyze-student/', views.AIAnalyzeStudentView.as_view(), name='ai-analyze-student'),
    path('profile/', views.AIStudentProfileView.as_view(), name='ai-student-profile'),
    path('recommendations/', views.AIRecommendationsView.as_view(), name='ai-recommendations'),
    path('learning-path/', views.PersonalizedPathView.as_view(), name='ai-learning-path'),
]
