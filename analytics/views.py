"""Analytics views."""
import json
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from accounts.views import student_required, teacher_required, admin_required
from gamification.models import XPTransaction
from datetime import date, timedelta


@student_required
def student_analytics(request):
    student = request.user
    profile = student.student_profile

    from datetime import date, timedelta
    today = date.today()
    xp_data = []
    for i in range(29, -1, -1):
        day = today - timedelta(days=i)
        day_xp = sum(
            XPTransaction.objects.filter(
                student=student, created_at__date=day, amount__gt=0
            ).values_list('amount', flat=True)
        )
        xp_data.append({'day': day.strftime('%m/%d'), 'xp': day_xp})

    return JsonResponse({'xp_data': xp_data, 'total_xp': profile.total_xp})


@teacher_required
def teacher_analytics(request):
    from accounts.models import StudentProfile
    from curriculum.models import QuizAttempt
    from coding.models import Submission

    data = {
        'avg_quiz_score': QuizAttempt.objects.filter(is_completed=True).aggregate(
            avg=__import__('django.db.models', fromlist=['Avg']).Avg('score')
        )['avg'] or 0,
        'total_submissions': Submission.objects.count(),
        'acceptance_rate': 0,
    }
    total = data['total_submissions']
    if total > 0:
        accepted = Submission.objects.filter(status='ACCEPTED').count()
        data['acceptance_rate'] = int((accepted / total) * 100)

    return JsonResponse(data)


@admin_required
def admin_analytics(request):
    from accounts.models import User
    from subjects.models import Subject

    data = {
        'total_users': User.objects.count(),
        'students': User.objects.filter(role='STUDENT').count(),
        'teachers': User.objects.filter(role='TEACHER').count(),
        'total_xp': sum(XPTransaction.objects.filter(amount__gt=0).values_list('amount', flat=True)),
    }
    return JsonResponse(data)
