"""Assessment REST API Views."""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from .models import AssessmentSession, AssessmentDay, AssessmentQuestion, AssessmentAttempt, StudentContentFormatResult
from gamification.models import XPTransaction
from accounts.models import StudentProfile


class AssessmentSessionView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user if request.user.is_authenticated else None
        if not user:
            # Provide default guest session for immediate interactive onboarding
            return Response({
                'id': 1,
                'current_day': 1,
                'is_completed': False,
                'overall_score': 0.0,
                'ai_profile_generated': False,
            })

        session, _ = AssessmentSession.objects.get_or_create(
            student=user,
            is_completed=False,
            defaults={'current_day': 1}
        )
        return Response({
            'id': session.id,
            'current_day': session.current_day,
            'is_completed': session.is_completed,
            'overall_score': session.overall_score,
            'ai_profile_generated': session.ai_profile_generated,
        })


class AssessmentDayDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, day):
        questions = AssessmentQuestion.objects.filter(day_number=day).order_by('order')
        question_data = []
        for q in questions:
            question_data.append({
                'id': q.id,
                'day_number': q.day_number,
                'subject_tag': q.subject_tag,
                'question_type': q.question_type,
                'format_type': q.format_type,
                'title': q.title,
                'prompt': q.prompt,
                'code_snippet': q.code_snippet,
                'media_url': q.media_url,
                'interactive_data': q.interactive_data,
                'options': q.options,
                'points': q.points,
                'difficulty': q.difficulty,
                'order': q.order,
            })
        return Response({
            'day': day,
            'total_questions': len(question_data),
            'questions': question_data
        })


class AssessmentSubmitAnswerView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        question_id = request.data.get('question_id')
        selected_answer = request.data.get('selected_answer', '').strip()
        time_spent = int(request.data.get('time_spent_seconds', 0))

        question = AssessmentQuestion.objects.filter(id=question_id).first()
        if not question:
            return Response({'error': 'Question not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Robust comparison supporting full text, letter prefix, or stripped value
        sel_clean = selected_answer.strip().lower()
        corr_clean = question.correct_answer.strip().lower()

        is_correct = (sel_clean == corr_clean)
        if not is_correct:
            # Check letter prefix matching (e.g., "C. 5" matching "C" or "5")
            if len(corr_clean) >= 3 and corr_clean[1] in ['.', ')', ':']:
                c_letter = corr_clean[0]
                c_text = corr_clean[2:].strip()
                if sel_clean in [c_letter, c_text]:
                    is_correct = True
            if not is_correct and len(sel_clean) >= 3 and sel_clean[1] in ['.', ')', ':']:
                s_letter = sel_clean[0]
                s_text = sel_clean[2:].strip()
                if corr_clean in [s_letter, s_text]:
                    is_correct = True

        points_earned = question.points if is_correct else 0

        # If user is authenticated, record attempt
        if request.user.is_authenticated:
            session, _ = AssessmentSession.objects.get_or_create(student=request.user, is_completed=False)
            AssessmentAttempt.objects.create(
                session=session,
                day_number=question.day_number,
                question=question,
                selected_answer=selected_answer,
                is_correct=is_correct,
                time_spent_seconds=time_spent,
                points_earned=points_earned
            )

        return Response({
            'is_correct': is_correct,
            'correct_answer': question.correct_answer,
            'explanation': question.explanation,
            'points_earned': points_earned
        })


class AssessmentCompleteDayView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, day):
        score_percentage = float(request.data.get('score_percentage', 0.0))
        total_time = int(request.data.get('total_time_seconds', 0))

        if request.user.is_authenticated:
            user = request.user
            session, _ = AssessmentSession.objects.get_or_create(student=user, is_completed=False)

            # Update or create AssessmentDay summary
            day_obj, _ = AssessmentDay.objects.get_or_create(
                session=session,
                day_number=day,
                defaults={
                    'title': f'Day {day} Assessment',
                    'is_completed': True,
                    'score_percentage': score_percentage,
                    'time_spent_seconds': total_time,
                    'completed_at': timezone.now()
                }
            )
            day_obj.is_completed = True
            day_obj.score_percentage = score_percentage
            day_obj.time_spent_seconds = total_time
            day_obj.completed_at = timezone.now()
            day_obj.save()

            # Advance current_day in session
            if session.current_day <= day:
                session.current_day = min(day + 1, 7)
                if day >= 7:
                    session.is_completed = True
                    session.completed_at = timezone.now()
                session.save()

            # Award deterministic +100 XP for completing the assessment day
            profile = getattr(user, 'student_profile', None)
            if profile:
                profile.total_xp += 100
                profile.save()
                XPTransaction.objects.create(
                    student=user,
                    amount=100,
                    source=XPTransaction.Source.QUIZ,
                    description=f'Completed 7-Day Assessment Day {day}'
                )

        return Response({
            'status': 'completed',
            'day': day,
            'next_day': min(day + 1, 7),
            'xp_earned': 100,
            'message': f'Day {day} assessment successfully completed!'
        })
