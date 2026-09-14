"""Coding URL configuration."""
from django.urls import path
from . import views

urlpatterns = [
    path('coding/', views.coding_arena, name='coding_arena'),
    path('coding/<slug:slug>/', views.challenge_detail, name='challenge_detail'),
    path('coding/<slug:slug>/submit/', views.submit_code, name='submit_code'),
    path('coding/<slug:slug>/run/', views.run_code, name='run_code'),
    path('submission/<int:submission_id>/', views.submission_detail, name='submission_detail'),
    path('submission/<int:submission_id>/analyze/', views.analyze_code, name='analyze_code'),
    path('submission/<int:submission_id>/explain/', views.explain_code_view, name='explain_code'),
    path('submission/<int:submission_id>/optimize/', views.optimize_code_view, name='optimize_code'),
]
