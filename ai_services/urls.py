"""AI Services URL configuration."""
from django.urls import path
from . import views

urlpatterns = [
    path('analyze/', views.analyze_code_direct, name='ai_analyze_direct'),
    path('analyze/<int:submission_id>/', views.analyze_view, name='ai_analyze'),
    path('explain/', views.explain_view, name='ai_explain'),
    path('optimize/', views.optimize_view, name='ai_optimize'),
]
