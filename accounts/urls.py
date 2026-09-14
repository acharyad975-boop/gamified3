"""Accounts URL configuration."""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_redirect, name='home'),
    path('register/', views.register_view, name='register'),
    path('api/send-otp/', views.send_registration_otp_view, name='send_registration_otp'),
    path('api/verify-otp/', views.verify_registration_otp_view, name='verify_registration_otp'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('verify-email/<uuid:token>/', views.verify_email, name='verify_email'),
    path('resend-verification/', views.resend_verification, name='resend_verification'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('reset-password/<uidb64>/<token>/', views.reset_password, name='reset_password'),
    path('profile/<str:username>/', views.public_profile, name='public_profile'),

    # Teacher
    path('teacher/dashboard/', views.teacher_dashboard, name='teacher_dashboard'),
    path('teacher/lessons/', views.teacher_lessons, name='teacher_lessons'),
    path('teacher/lessons/create/', views.teacher_lesson_create, name='teacher_lesson_create'),
    path('teacher/lessons/<int:pk>/edit/', views.teacher_lesson_edit, name='teacher_lesson_edit'),
    path('teacher/quizzes/', views.teacher_quizzes, name='teacher_quizzes'),
    path('teacher/quizzes/create/', views.teacher_quiz_create, name='teacher_quiz_create'),
    path('teacher/quizzes/<int:pk>/edit/', views.teacher_quiz_edit, name='teacher_quiz_edit'),
    path('teacher/challenges/', views.teacher_challenges, name='teacher_challenges'),
    path('teacher/challenges/create/', views.teacher_challenge_create, name='teacher_challenge_create'),
    path('teacher/challenges/<int:pk>/edit/', views.teacher_challenge_edit, name='teacher_challenge_edit'),
    path('teacher/students/', views.teacher_students, name='teacher_students'),
    path('teacher/competitions/create/', views.teacher_competition_create, name='teacher_competition_create'),

    # Admin
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin-dashboard/users/', views.admin_users, name='admin_users'),

    # Errors
    path('403/', views.error_403, name='error_403'),
]
