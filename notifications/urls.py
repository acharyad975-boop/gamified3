"""Notifications URL configuration."""
from django.urls import path
from . import views

urlpatterns = [
    path('', views.notifications_list, name='notifications_list'),
    path('mark-read/<int:notification_id>/', views.mark_read, name='mark_notification_read'),
    path('mark-all-read/', views.mark_all_read, name='mark_all_notifications_read'),
]
