"""AI Engine REST API Views."""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import AIStudentProfile, PersonalizedLearningPath, AIRecommendation
from .services import AIService
from assessments.models import AssessmentSession


class AIAnalyzeStudentView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        if not user:
            from accounts.models import User
            user = User.objects.filter(role=User.Role.STUDENT).first() or User.objects.first()

        session = AssessmentSession.objects.filter(student=user).first() if user else None
        ai_service = AIService()
        profile_data = ai_service.analyze_student(user, session)

        return Response({
            'status': 'success',
            'message': 'AI profile and personalized curriculum path synthesized successfully.',
            'profile': profile_data
        })


class AIStudentProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user if request.user.is_authenticated else None
        target_student_id = request.GET.get('student_id')

        if target_student_id and user:
            # If a student attempts to view another student's profile, return 403 Forbidden
            if user.role == 'STUDENT' and str(target_student_id) != str(user.id):
                return Response(
                    {'error': '403 Forbidden: You are not authorized to view this student\'s information.'},
                    status=403
                )
            from accounts.models import User as UserModel
            target_user = UserModel.objects.filter(id=target_student_id).first()
            if target_user:
                user = target_user

        if not user:
            from accounts.models import User as UserModel
            user = UserModel.objects.filter(role=UserModel.Role.STUDENT).first() or UserModel.objects.first()

        profile = AIStudentProfile.objects.filter(student=user).first() if user else None
        
        # If no profile exists yet, trigger synthesis
        if not profile and user:
            session = AssessmentSession.objects.filter(student=user).first()
            ai_service = AIService()
            ai_service.analyze_student(user, session)
            profile = AIStudentProfile.objects.filter(student=user).first()

        if not profile:
            return Response({'has_profile': False, 'message': 'Complete the 7-day assessment to generate your AI profile.'})

        domain_scores = profile.raw_llm_response.get('domain_scores') if profile and profile.raw_llm_response else {
            'programming_logic': 85.0,
            'mathematics': 60.0,
            'computer_fundamentals': 90.0,
            'english_communication': 70.0,
            'analytical_reasoning': 75.0
        }

        return Response({
            'has_profile': True,
            'student_summary': profile.student_summary,
            'recommended_starting_subject': profile.recommended_starting_subject,
            'recommended_difficulty': profile.recommended_difficulty,
            'domain_scores': domain_scores,
            'strengths': profile.strengths,
            'improvement_areas': profile.improvement_areas,
            'effective_learning_formats': profile.effective_learning_formats,
            'recommended_path': profile.recommended_path,
            'recommendations': profile.recommendations,
            'model_version': profile.model_version,
            'ai_provider': profile.ai_provider
        })


class AIRecommendationsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user if request.user.is_authenticated else None
        if not user:
            from accounts.models import User
            user = User.objects.first()

        recs = AIRecommendation.objects.filter(student=user).order_by('-created_at') if user else []
        return Response([{
            'id': r.id,
            'title': r.title,
            'reason': r.reason,
            'suggested_changes': r.suggested_changes,
            'is_applied': r.is_applied,
            'created_at': r.created_at
        } for r in recs])


class PersonalizedPathView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user if request.user.is_authenticated else None
        if not user:
            from accounts.models import User
            user = User.objects.first()

        path = None
        if user:
            path = PersonalizedLearningPath.objects.filter(student=user, is_active=True).first()
        if not path:
            path = PersonalizedLearningPath.objects.filter(is_active=True).first()

        if not path:
            return Response({'has_path': False})
        items = path.items.all().order_by('order')
        return Response({
            'has_path': True,
            'title': path.title,
            'description': path.description,
            'progress_percentage': path.progress_percentage,
            'items': [{
                'id': item.id,
                'title': item.title,
                'order': item.order,
                'is_completed': item.is_completed,
                'is_unlocked': item.is_unlocked
            } for item in items]
        })
