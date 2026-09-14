"""Coding Arena views."""
import json
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.utils import timezone
from django.db.models import Count, Avg

from accounts.views import student_required
from .models import CodingChallenge, Submission, TestCase, CodeExecution
from subjects.models import ProgrammingLanguage, Subject


@student_required
def coding_arena(request):
    difficulty = request.GET.get('difficulty', '')
    subject_slug = request.GET.get('subject', '')
    language_slug = request.GET.get('language', '')
    search = request.GET.get('q', '')

    challenges = CodingChallenge.objects.filter(is_active=True).select_related(
        'subject', 'language'
    ).annotate(
        submission_count=Count('submissions'),
        accepted_count=Count('submissions', filter=__import__('django.db.models', fromlist=['Q']).Q(submissions__status='ACCEPTED'))
    )

    if difficulty:
        challenges = challenges.filter(difficulty=difficulty)
    if subject_slug:
        challenges = challenges.filter(subject__slug=subject_slug)
    if language_slug:
        challenges = challenges.filter(language__slug=language_slug)
    if search:
        challenges = challenges.filter(title__icontains=search)

    # Mark user's solved challenges
    student = request.user
    solved_ids = set(Submission.objects.filter(
        student=student, status='ACCEPTED'
    ).values_list('challenge_id', flat=True))

    subjects = Subject.objects.filter(is_active=True)
    languages = ProgrammingLanguage.objects.filter(is_active=True)

    return render(request, 'student/coding_arena.html', {
        'challenges': challenges,
        'solved_ids': solved_ids,
        'subjects': subjects,
        'languages': languages,
        'filters': {
            'difficulty': difficulty,
            'subject': subject_slug,
            'language': language_slug,
            'q': search,
        },
    })


@student_required
def challenge_detail(request, slug):
    challenge = get_object_or_404(CodingChallenge, slug=slug, is_active=True)
    student = request.user

    # Public test cases
    public_tests = challenge.test_cases.filter(is_hidden=False).order_by('order')

    # User's submissions
    user_submissions = Submission.objects.filter(
        student=student, challenge=challenge
    ).select_related('language').order_by('-submitted_at')

    # Best submission
    best_submission = user_submissions.filter(status='ACCEPTED').first()
    my_submissions = user_submissions[:5]

    # Languages available
    languages = ProgrammingLanguage.objects.filter(is_active=True)

    # Stats
    total_submissions = challenge.submissions.count()
    accepted_submissions = challenge.submissions.filter(status='ACCEPTED').count()
    acceptance_rate = int((accepted_submissions / total_submissions * 100)) if total_submissions > 0 else 0

    return render(request, 'student/challenge_detail.html', {
        'challenge': challenge,
        'public_tests': public_tests,
        'my_submissions': my_submissions,
        'best_submission': best_submission,
        'languages': languages,
        'total_submissions': total_submissions,
        'acceptance_rate': acceptance_rate,
        'is_solved': best_submission is not None,
    })


@student_required
def submit_code(request, slug):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    challenge = get_object_or_404(CodingChallenge, slug=slug, is_active=True)
    student = request.user

    data = json.loads(request.body)
    source_code = data.get('code', '').strip()
    language_slug = data.get('language', 'python')

    if not source_code:
        return JsonResponse({'error': 'Code cannot be empty.'}, status=400)

    try:
        language = ProgrammingLanguage.objects.get(slug=language_slug)
    except ProgrammingLanguage.DoesNotExist:
        language = None

    # Create submission
    submission = Submission.objects.create(
        student=student,
        challenge=challenge,
        language=language,
        source_code=source_code,
        status='PENDING',
    )

    # Run against all test cases
    from coding.executor import run_against_test_cases
    test_cases = list(challenge.test_cases.all().order_by('order'))

    if not test_cases:
        submission.status = 'ACCEPTED'
        submission.passed_tests = 0
        submission.total_tests = 0
        submission.save()
    else:
        results, passed = run_against_test_cases(submission, test_cases)
        total = len(test_cases)

        # Determine final status
        any_tle = any(r.get('error') == 'TIME_LIMIT_EXCEEDED' for r in results)
        any_runtime = any(r.get('error') == 'RUNTIME_ERROR' for r in results)

        if passed == total:
            status = 'ACCEPTED'
        elif any_tle:
            status = 'TLE'
        elif any_runtime:
            status = 'RUNTIME_ERROR'
        else:
            status = 'WRONG_ANSWER'

        submission.status = status
        submission.passed_tests = passed
        submission.total_tests = total
        submission.save()

        # Award XP for first acceptance
        if status == 'ACCEPTED':
            already_solved = Submission.objects.filter(
                student=student, challenge=challenge, status='ACCEPTED'
            ).exclude(pk=submission.pk).exists()

            if not already_solved:
                from gamification.engine import award_xp
                award_xp(
                    student=student,
                    amount=challenge.xp_reward,
                    source='CHALLENGE',
                    description=f'Solved challenge: {challenge.title}',
                    reference_id=challenge.id,
                )
                profile = student.student_profile
                profile.challenges_completed += 1
                profile.save(update_fields=['challenges_completed'])

            # Trigger AI analysis asynchronously (in same thread for simplicity)
            try:
                from ai_services.analyzer import analyze_submission
                analyze_submission(submission)
            except Exception:
                pass

    return JsonResponse({
        'success': True,
        'submission_id': submission.id,
        'status': submission.status,
        'passed_tests': submission.passed_tests,
        'total_tests': submission.total_tests,
        'pass_rate': submission.pass_rate,
    })


@student_required
def run_code(request, slug):
    """Run code against public test cases only (no submission saved)."""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    challenge = get_object_or_404(CodingChallenge, slug=slug, is_active=True)
    data = json.loads(request.body)
    source_code = data.get('code', '').strip()
    language_slug = data.get('language', 'python')
    custom_input = data.get('custom_input', '')

    from coding.executor import execute_code
    result = execute_code(
        source_code=source_code,
        language_slug=language_slug,
        stdin_data=custom_input,
        timeout=challenge.time_limit_seconds,
    )

    return JsonResponse({
        'success': result['error'] is None,
        'stdout': result['stdout'],
        'stderr': result['stderr'],
        'runtime_ms': result['runtime_ms'],
        'error': result['error'],
    })


@student_required
def submission_detail(request, submission_id):
    submission = get_object_or_404(Submission, pk=submission_id, student=request.user)
    executions = submission.executions.select_related('test_case').order_by('test_case__order')

    # Get AI analysis if available
    analysis = getattr(submission, 'analysis', None)

    return render(request, 'student/submission_detail.html', {
        'submission': submission,
        'executions': executions,
        'analysis': analysis,
    })


@student_required
def analyze_code(request, submission_id):
    submission = get_object_or_404(Submission, pk=submission_id, student=request.user)

    try:
        from ai_services.analyzer import analyze_submission
        analysis = analyze_submission(submission)
        return JsonResponse({
            'success': True,
            'total_score': analysis.total_score,
            'correctness_score': analysis.correctness_score,
            'quality_score': analysis.quality_score,
            'readability_score': analysis.readability_score,
            'efficiency_score': analysis.efficiency_score,
            'best_practices_score': analysis.best_practices_score,
            'time_complexity': analysis.time_complexity,
            'space_complexity': analysis.space_complexity,
            'feedback': analysis.feedback,
            'suggestions': analysis.suggestions,
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


@student_required
def explain_code_view(request, submission_id):
    submission = get_object_or_404(Submission, pk=submission_id, student=request.user)
    lang = submission.language.slug if submission.language else 'python'

    from ai_services.analyzer import explain_code
    explanation = explain_code(submission.source_code, lang)

    return JsonResponse({'success': True, 'explanation': explanation})


@student_required
def optimize_code_view(request, submission_id):
    submission = get_object_or_404(Submission, pk=submission_id, student=request.user)
    lang = submission.language.slug if submission.language else 'python'

    from ai_services.analyzer import optimize_code
    result = optimize_code(submission.source_code, lang)

    return JsonResponse({
        'success': True,
        'optimized_code': result['optimized_code'],
        'suggestions': result['suggestions'],
        'original_complexity': result['original_complexity'],
        'optimized_complexity': result['optimized_complexity'],
    })
