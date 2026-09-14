"""Authentication API URL configuration."""
from django.urls import path
from . import api_views

urlpatterns = [
    path('register/', api_views.APIRegisterView.as_view(), name='api-register'),
    path('login/', api_views.APILoginView.as_view(), name='api-login'),
    path('logout/', api_views.APILogoutView.as_view(), name='api-logout'),
    path('me/', api_views.APICurrentUserView.as_view(), name='api-me'),
]
