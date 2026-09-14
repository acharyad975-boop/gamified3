"""Gamification views: leaderboard, achievements, rewards."""
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from accounts.views import student_required
from .models import Achievement, StudentAchievement, Reward, RewardPurchase, XPTransaction


@student_required
def leaderboard(request):
    scope = request.GET.get('scope', 'global')
    from gamification.engine import get_leaderboard_data
    from accounts.models import StudentProfile
    from datetime import datetime, timedelta
    from django.utils import timezone

    leaderboard_data = get_leaderboard_data(scope=scope)

    # Find current user's rank
    student = request.user
    profile = student.student_profile
    user_rank = next(
        (item['rank'] for item in leaderboard_data if item['username'] == student.username),
        None
    )

    return render(request, 'student/leaderboard.html', {
        'leaderboard': leaderboard_data,
        'scope': scope,
        'profile': profile,
        'user_rank': user_rank,
    })


@student_required
def achievements(request):
    student = request.user
    all_achievements = Achievement.objects.filter(is_active=True)
    unlocked_ids = set(
        StudentAchievement.objects.filter(student=student).values_list('achievement_id', flat=True)
    )

    achievement_data = []
    for a in all_achievements:
        is_unlocked = a.id in unlocked_ids
        # Calculate progress
        progress = 0
        profile = student.student_profile
        if a.condition_type == 'TOTAL_XP':
            progress = min(100, int((profile.total_xp / a.condition_value) * 100))
        elif a.condition_type == 'CHALLENGES_COMPLETED':
            progress = min(100, int((profile.challenges_completed / a.condition_value) * 100))
        elif a.condition_type == 'QUIZZES_COMPLETED':
            progress = min(100, int((profile.quizzes_completed / a.condition_value) * 100))
        elif a.condition_type == 'LESSONS_COMPLETED':
            progress = min(100, int((profile.lessons_completed / a.condition_value) * 100))
        elif a.condition_type == 'STREAK_DAYS':
            progress = min(100, int((profile.current_streak / a.condition_value) * 100))

        unlock_date = None
        if is_unlocked:
            sa = StudentAchievement.objects.filter(student=student, achievement=a).first()
            unlock_date = sa.unlocked_at if sa else None

        achievement_data.append({
            'achievement': a,
            'is_unlocked': is_unlocked,
            'progress': progress if not is_unlocked else 100,
            'unlock_date': unlock_date,
        })

    unlocked_count = len(unlocked_ids)

    return render(request, 'student/achievements.html', {
        'achievement_data': achievement_data,
        'unlocked_count': unlocked_count,
        'total_count': all_achievements.count(),
    })


@student_required
def rewards_store(request):
    student = request.user
    profile = student.student_profile
    rewards = Reward.objects.filter(is_active=True).order_by('xp_cost')
    purchased_ids = set(
        RewardPurchase.objects.filter(student=student).values_list('reward_id', flat=True)
    )
    return render(request, 'student/rewards.html', {
        'rewards': rewards,
        'profile': profile,
        'purchased_ids': purchased_ids,
    })


@student_required
def purchase_reward(request, reward_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    reward = get_object_or_404(Reward, pk=reward_id, is_active=True)
    student = request.user
    profile = student.student_profile

    if profile.total_xp < reward.xp_cost:
        return JsonResponse({
            'success': False,
            'error': f'Not enough XP. You need {reward.xp_cost} XP but have {profile.total_xp}.'
        })

    # Deduct XP
    from gamification.engine import award_xp
    award_xp(
        student=student,
        amount=-reward.xp_cost,
        source='REWARD_SPENT',
        description=f'Purchased reward: {reward.name}',
        reference_id=reward.id,
    )

    RewardPurchase.objects.create(
        student=student,
        reward=reward,
        xp_spent=reward.xp_cost,
    )

    return JsonResponse({
        'success': True,
        'message': f'Successfully purchased {reward.name}!',
        'new_xp': profile.total_xp - reward.xp_cost,
    })


@student_required
def xp_history(request):
    student = request.user
    transactions = XPTransaction.objects.filter(student=student).order_by('-created_at')[:100]
    return render(request, 'student/xp_history.html', {'transactions': transactions})
