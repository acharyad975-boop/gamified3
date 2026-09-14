"""Competition views."""
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.utils import timezone
from accounts.views import student_required
from .models import Competition, CompetitionParticipant, CompetitionProblem


@student_required
def competition_list(request):
    now = timezone.now()
    live = [c for c in Competition.objects.filter(is_active=True) if c.status == 'LIVE']
    upcoming = [c for c in Competition.objects.filter(is_active=True) if c.status == 'UPCOMING']
    completed = [c for c in Competition.objects.filter(is_active=True) if c.status == 'COMPLETED']

    student = request.user
    joined_ids = set(
        CompetitionParticipant.objects.filter(student=student).values_list('competition_id', flat=True)
    )

    return render(request, 'student/competitions.html', {
        'live': live,
        'upcoming': upcoming,
        'completed': completed[:10],
        'joined_ids': joined_ids,
    })


@student_required
def competition_detail(request, slug):
    competition = get_object_or_404(Competition, slug=slug, is_active=True)
    student = request.user

    is_joined = CompetitionParticipant.objects.filter(
        competition=competition, student=student
    ).exists()

    problems = competition.problems.select_related('challenge').order_by('order')
    leaderboard = competition.participants.select_related(
        'student__student_profile'
    ).order_by('rank', '-score')[:20]

    return render(request, 'student/competition_detail.html', {
        'competition': competition,
        'is_joined': is_joined,
        'problems': problems,
        'leaderboard': leaderboard,
        'status': competition.status,
        'time_remaining': competition.time_remaining,
    })


@student_required
def join_competition(request, slug):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    competition = get_object_or_404(Competition, slug=slug, is_active=True)
    student = request.user

    if competition.status == 'COMPLETED':
        return JsonResponse({'success': False, 'error': 'Competition has already ended.'})

    obj, created = CompetitionParticipant.objects.get_or_create(
        competition=competition, student=student
    )

    if created:
        return JsonResponse({'success': True, 'message': f'Joined {competition.name}!'})
    return JsonResponse({'success': False, 'error': 'You have already joined this competition.'})


@student_required
def competition_leaderboard(request, slug):
    competition = get_object_or_404(Competition, slug=slug)
    participants = competition.participants.select_related(
        'student__student_profile'
    ).order_by('rank', '-score')

    return render(request, 'student/competition_leaderboard.html', {
        'competition': competition,
        'participants': participants,
    })
