"""URL routing for Teacher Dashboard API."""
from django.urls import path
from .views import (
    TeacherOverviewView,
    TeacherStudentsListView,
    TeacherStudentDetailView,
    TeacherExportStudentsExcelView,
    TeacherClassesView,
    TeacherAssignmentsView,
    TeacherAIAssistantView,
    TeacherNotificationsView,
)

urlpatterns = [
    path('overview/', TeacherOverviewView.as_view(), name='teacher-overview'),
    path('students/', TeacherStudentsListView.as_view(), name='teacher-students-list'),
    path('students/<int:student_id>/', TeacherStudentDetailView.as_view(), name='teacher-student-detail'),
    path('students/export/', TeacherExportStudentsExcelView.as_view(), name='teacher-students-export'),
    path('classes/', TeacherClassesView.as_view(), name='teacher-classes'),
    path('assignments/', TeacherAssignmentsView.as_view(), name='teacher-assignments'),
    path('ai-assistant/', TeacherAIAssistantView.as_view(), name='teacher-ai-assistant'),
    path('notifications/', TeacherNotificationsView.as_view(), name='teacher-notifications'),
]
