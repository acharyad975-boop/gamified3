"""Curriculum URL configuration (student portal)."""
from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.student_dashboard, name='student_dashboard'),
    path('learning/', views.my_learning, name='my_learning'),
    path('learning/<slug:subject_slug>/', views.subject_detail, name='subject_detail'),
    path('learning/<slug:subject_slug>/level/<int:level_num>/', views.level_detail, name='level_detail'),
    path('learning/lesson/<int:lesson_id>/', views.lesson_detail, name='lesson_detail'),
    path('learning/lesson/<int:lesson_id>/complete/', views.complete_lesson, name='complete_lesson'),

    # Quizzes
    path('quiz/', views.quiz_list, name='quiz_list'),
    path('quiz/<int:quiz_id>/', views.quiz_start, name='quiz_start'),
    path('quiz/<int:quiz_id>/take/', views.quiz_take, name='quiz_take'),
    path('quiz/<int:quiz_id>/submit/', views.quiz_submit, name='quiz_submit'),
    path('quiz/attempt/<int:attempt_id>/result/', views.quiz_result, name='quiz_result'),

    # Progress
    path('progress/', views.student_progress, name='student_progress'),

    # Settings
    path('settings/', views.student_settings, name='student_settings'),
]
