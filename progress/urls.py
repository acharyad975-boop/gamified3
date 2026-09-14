"""Progress API URL configuration."""
from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.StudentDashboardOverviewView.as_view(), name='student-dashboard-overview'),
]
