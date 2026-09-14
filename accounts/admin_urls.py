"""URL routing for Admin Management API."""
from django.urls import path
from .admin_api import AdminOverviewView, AdminUsersView, AdminExportPlatformDataView

urlpatterns = [
    path('overview/', AdminOverviewView.as_view(), name='admin-overview'),
    path('users/', AdminUsersView.as_view(), name='admin-users'),
    path('export/', AdminExportPlatformDataView.as_view(), name='admin-export'),
]
