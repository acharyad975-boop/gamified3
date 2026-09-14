"""Analytics URL configuration."""
from django.urls import path
from . import views

urlpatterns = [
    path('student/', views.student_analytics, name='student_analytics'),
    path('teacher/', views.teacher_analytics, name='teacher_analytics'),
    path('admin/', views.admin_analytics, name='admin_analytics'),
]
