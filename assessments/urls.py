"""Assessment API URL configuration."""
from django.urls import path
from . import views

urlpatterns = [
    path('session/', views.AssessmentSessionView.as_view(), name='assessment-session'),
    path('day/<int:day>/', views.AssessmentDayDetailView.as_view(), name='assessment-day-detail'),
    path('submit-answer/', views.AssessmentSubmitAnswerView.as_view(), name='assessment-submit-answer'),
    path('complete-day/<int:day>/', views.AssessmentCompleteDayView.as_view(), name='assessment-complete-day'),
]
