"""Progress REST API Views."""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.models import StudentProfile


class StudentDashboardOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile, _ = StudentProfile.objects.get_or_create(user=user)
        xp_in_level, xp_needed, percentage = profile.get_xp_progress()
        
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'full_name': user.get_full_name() or user.username,
                'email': user.email,
                'role': user.role,
            },
            'profile': {
                'total_xp': profile.total_xp,
                'current_level': profile.current_level,
                'xp_in_level': xp_in_level,
                'xp_needed': xp_needed,
                'level_percentage': percentage,
                'current_streak': profile.current_streak,
                'longest_streak': profile.longest_streak,
                'challenges_completed': profile.challenges_completed,
                'quizzes_completed': profile.quizzes_completed,
                'lessons_completed': profile.lessons_completed,
                'educational_year': profile.educational_year,
                'current_semester': profile.current_semester,
                'programming_experience': profile.programming_experience,
                'interests': profile.interests,
            }
        })
