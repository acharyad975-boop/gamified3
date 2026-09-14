"""Curriculum views: dashboard, learning, quizzes."""
import json
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.utils import timezone
from django.db.models import Count, Avg

from accounts.views import student_required
from .models import Level, Lesson, LearningProgress, Quiz, Question, QuizAttempt, QuizAnswer


@student_required
def student_dashboard(request):
    student = request.user
    profile = student.student_profile
    xp_progress = profile.get_xp_progress()

    # Recent progress
    recent_lessons = LearningProgress.objects.filter(
        student=student, is_completed=True
    ).select_related('lesson__level__subject').order_by('-completed_at')[:5]

    # Recent quiz attempts
    recent_quizzes = QuizAttempt.objects.filter(
        student=student, is_completed=True
    ).select_related('quiz').order_by('-completed_at')[:5]

    # Recent submissions
    from coding.models import Submission
    recent_submissions = Submission.objects.filter(
        student=student
    ).select_related('challenge', 'language').order_by('-submitted_at')[:5]

    # XP history (last 7 days)
    from gamification.models import XPTransaction
    from datetime import date, timedelta
    today = date.today()
    xp_history = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        day_xp = XPTransaction.objects.filter(
            student=student,
            created_at__date=day,
            amount__gt=0
        ).aggregate(total=Count('amount'))['total'] or 0
        xp_history.append({'day': day.strftime('%a'), 'xp': day_xp})

    # Recent achievements
    recent_achievements = student.student_achievements.select_related(
        'achievement'
    ).order_by('-unlocked_at')[:4]

    # Upcoming competitions
    from competitions.models import Competition
    upcoming = Competition.objects.filter(
        start_time__gt=timezone.now(), is_active=True
    ).order_by('start_time')[:2]

    # Daily quiz recommendation
    daily_quiz = Quiz.objects.filter(is_active=True).order_by('?').first()

    # Daily challenge recommendation
    from coding.models import CodingChallenge
    daily_challenge = CodingChallenge.objects.filter(is_active=True).order_by('?').first()

    # Leaderboard rank
    from accounts.models import StudentProfile
    higher_xp = StudentProfile.objects.filter(total_xp__gt=profile.total_xp).count()
    rank = higher_xp + 1

    return render(request, 'student/dashboard.html', {
        'profile': profile,
        'xp_progress': xp_progress,
        'xp_in_level': xp_progress[0],
        'xp_needed': xp_progress[1],
        'xp_percentage': xp_progress[2],
        'recent_lessons': recent_lessons,
        'recent_quizzes': recent_quizzes,
        'recent_submissions': recent_submissions,
        'xp_history': json.dumps(xp_history),
        'recent_achievements': recent_achievements,
        'upcoming_competitions': upcoming,
        'daily_quiz': daily_quiz,
        'daily_challenge': daily_challenge,
        'rank': rank,
    })


@student_required
def my_learning(request):
    from subjects.models import Subject
    subjects = Subject.objects.filter(is_active=True).prefetch_related('levels')

    # Calculate progress per subject
    student = request.user
    subject_data = []
    for subject in subjects:
        total_lessons = Lesson.objects.filter(level__subject=subject).count()
        completed_lessons = LearningProgress.objects.filter(
            student=student, lesson__level__subject=subject, is_completed=True
        ).count()
        pct = int((completed_lessons / total_lessons * 100) if total_lessons > 0 else 0)
        subject_data.append({
            'subject': subject,
            'total_lessons': total_lessons,
            'completed_lessons': completed_lessons,
            'progress_pct': pct,
        })

    return render(request, 'student/my_learning.html', {'subject_data': subject_data})


@student_required
def subject_detail(request, subject_slug):
    from subjects.models import Subject
    subject = get_object_or_404(Subject, slug=subject_slug, is_active=True)
    levels = subject.levels.filter(is_active=True).prefetch_related('lessons')

    student = request.user
    level_data = []
    for level in levels:
        total = level.lessons.count()
        completed = LearningProgress.objects.filter(
            student=student, lesson__level=level, is_completed=True
        ).count()
        pct = int((completed / total * 100) if total > 0 else 0)
        is_unlocked = level.number == 1 or (completed > 0)
        level_data.append({
            'level': level,
            'total': total,
            'completed': completed,
            'pct': pct,
            'is_unlocked': is_unlocked,
        })

    return render(request, 'student/subject_detail.html', {
        'subject': subject,
        'level_data': level_data,
    })


@student_required
def level_detail(request, subject_slug, level_num):
    from subjects.models import Subject
    subject = get_object_or_404(Subject, slug=subject_slug)
    level = get_object_or_404(Level, subject=subject, number=level_num)
    lessons = level.lessons.filter(is_active=True).order_by('order')

    student = request.user
    progress_map = {
        p.lesson_id: p for p in LearningProgress.objects.filter(student=student, lesson__level=level)
    }

    quizzes = level.quizzes.filter(is_active=True)
    from coding.models import CodingChallenge
    challenges = CodingChallenge.objects.filter(level=level, is_active=True)

    return render(request, 'student/level_detail.html', {
        'subject': subject,
        'level': level,
        'lessons': lessons,
        'progress_map': progress_map,
        'quizzes': quizzes,
        'challenges': challenges,
    })


@student_required
def lesson_detail(request, lesson_id):
    lesson = get_object_or_404(Lesson, pk=lesson_id, is_active=True)
    student = request.user

    progress, created = LearningProgress.objects.get_or_create(
        student=student, lesson=lesson,
        defaults={'is_started': True, 'started_at': timezone.now()}
    )
    if not progress.is_started:
        progress.is_started = True
        progress.started_at = timezone.now()
        progress.save()

    # Next/previous lessons
    all_lessons = list(lesson.level.lessons.filter(is_active=True).order_by('order'))
    current_idx = next((i for i, l in enumerate(all_lessons) if l.id == lesson.id), 0)
    prev_lesson = all_lessons[current_idx - 1] if current_idx > 0 else None
    next_lesson = all_lessons[current_idx + 1] if current_idx < len(all_lessons) - 1 else None

    related_quizzes = lesson.quizzes.filter(is_active=True)

    return render(request, 'student/lesson_detail.html', {
        'lesson': lesson,
        'progress': progress,
        'prev_lesson': prev_lesson,
        'next_lesson': next_lesson,
        'related_quizzes': related_quizzes,
    })


@student_required
def complete_lesson(request, lesson_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    lesson = get_object_or_404(Lesson, pk=lesson_id)
    student = request.user

    progress, created = LearningProgress.objects.get_or_create(student=student, lesson=lesson)

    if not progress.is_completed:
        progress.is_completed = True
        progress.completed_at = timezone.now()
        progress.save()

        # Award XP
        from gamification.engine import award_xp
        new_xp, leveled_up, new_level = award_xp(
            student=student,
            amount=lesson.xp_reward,
            source='LESSON',
            description=f'Completed lesson: {lesson.title}',
            reference_id=lesson.id,
        )

        # Update profile counter
        student.student_profile.lessons_completed += 1
        student.student_profile.save(update_fields=['lessons_completed'])

        return JsonResponse({
            'success': True,
            'xp_earned': lesson.xp_reward,
            'new_total_xp': new_xp,
            'leveled_up': leveled_up,
            'new_level': new_level,
            'already_completed': False,
        })
    else:
        return JsonResponse({'success': True, 'already_completed': True, 'xp_earned': 0})


# ─── Quiz Views ──────────────────────────────────────────────────────────────

@student_required
def quiz_list(request):
    subject_filter = request.GET.get('subject', '')
    difficulty_filter = request.GET.get('difficulty', '')

    quizzes = Quiz.objects.filter(is_active=True).select_related(
        'lesson__level__subject', 'level__subject'
    ).annotate(question_count=Count('questions'))

    if subject_filter:
        quizzes = quizzes.filter(lesson__level__subject__slug=subject_filter) | \
                  quizzes.filter(level__subject__slug=subject_filter)
    if difficulty_filter:
        quizzes = quizzes.filter(difficulty=difficulty_filter)

    from subjects.models import Subject
    subjects = Subject.objects.filter(is_active=True)

    # Add attempt info
    student = request.user
    attempted_ids = set(QuizAttempt.objects.filter(
        student=student, is_completed=True
    ).values_list('quiz_id', flat=True))

    return render(request, 'student/quiz_list.html', {
        'quizzes': quizzes,
        'subjects': subjects,
        'attempted_ids': attempted_ids,
        'subject_filter': subject_filter,
        'difficulty_filter': difficulty_filter,
    })


@student_required
def quiz_start(request, quiz_id):
    quiz = get_object_or_404(Quiz, pk=quiz_id, is_active=True)
    question_count = quiz.questions.count()
    return render(request, 'student/quiz_start.html', {
        'quiz': quiz,
        'question_count': question_count,
    })


@student_required
def quiz_take(request, quiz_id):
    quiz = get_object_or_404(Quiz, pk=quiz_id, is_active=True)
    questions = list(quiz.questions.all().order_by('order'))

    if not questions:
        from django.contrib import messages
        messages.warning(request, 'This quiz has no questions yet.')
        return redirect('quiz_list')

    # Create attempt
    attempt = QuizAttempt.objects.create(
        student=request.user,
        quiz=quiz,
        max_score=sum(q.points for q in questions),
    )

    questions_data = []
    for q in questions:
        questions_data.append({
            'id': q.id,
            'text': q.text,
            'type': q.question_type,
            'code_snippet': q.code_snippet,
            'options': q.get_options(),
            'points': q.points,
        })

    return render(request, 'student/quiz_take.html', {
        'quiz': quiz,
        'attempt': attempt,
        'questions': questions,
        'questions_data': json.dumps(questions_data),
        'time_limit': quiz.time_limit_minutes * 60,
    })


@student_required
def quiz_submit(request, quiz_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    quiz = get_object_or_404(Quiz, pk=quiz_id)
    attempt_id = request.POST.get('attempt_id')
    attempt = get_object_or_404(QuizAttempt, pk=attempt_id, student=request.user, is_completed=False)

    questions = quiz.questions.all()
    total_score = 0
    answers_data = []

    for question in questions:
        selected = request.POST.get(f'answer_{question.id}', '').strip()
        is_correct = (selected == question.correct_answer)
        points_earned = question.points if is_correct else 0
        total_score += points_earned

        QuizAnswer.objects.create(
            attempt=attempt,
            question=question,
            selected_answer=selected,
            is_correct=is_correct,
            points_earned=points_earned,
        )

        answers_data.append({
            'question_id': question.id,
            'selected': selected,
            'correct': question.correct_answer,
            'is_correct': is_correct,
            'explanation': question.explanation,
        })

    # Calculate XP
    percentage = int((total_score / attempt.max_score * 100)) if attempt.max_score > 0 else 0
    xp_earned = int(quiz.xp_reward * (percentage / 100)) if percentage >= quiz.passing_score else int(quiz.xp_reward * 0.2)
    if percentage == 100:
        xp_earned = int(quiz.xp_reward * 1.5)  # Bonus for perfect score

    attempt.score = total_score
    attempt.xp_earned = xp_earned
    attempt.is_completed = True
    attempt.completed_at = timezone.now()
    attempt.save()

    # Award XP
    from gamification.engine import award_xp
    award_xp(
        student=request.user,
        amount=xp_earned,
        source='QUIZ',
        description=f'Completed quiz: {quiz.title} ({percentage}%)',
        reference_id=quiz.id,
    )

    # Update profile stats
    profile = request.user.student_profile
    profile.quizzes_completed += 1
    # Update quiz score average
    all_attempts = QuizAttempt.objects.filter(student=request.user, is_completed=True)
    profile.quiz_score = all_attempts.aggregate(avg=Avg('score'))['avg'] or 0
    profile.save(update_fields=['quizzes_completed', 'quiz_score'])

    return JsonResponse({
        'success': True,
        'attempt_id': attempt.id,
        'score': total_score,
        'max_score': attempt.max_score,
        'percentage': percentage,
        'passed': percentage >= quiz.passing_score,
        'xp_earned': xp_earned,
        'answers': answers_data,
    })


@student_required
def quiz_result(request, attempt_id):
    attempt = get_object_or_404(QuizAttempt, pk=attempt_id, student=request.user)
    answers = attempt.answers.select_related('question').order_by('question__order')

    correct_count = answers.filter(is_correct=True).count()
    wrong_count = answers.filter(is_correct=False).count()

    return render(request, 'student/quiz_result.html', {
        'attempt': attempt,
        'answers': answers,
        'correct_count': correct_count,
        'wrong_count': wrong_count,
    })


# ─── Progress ─────────────────────────────────────────────────────────────────

@student_required
def student_progress(request):
    student = request.user
    profile = student.student_profile

    from subjects.models import Subject
    subjects = Subject.objects.filter(is_active=True)

    subject_progress = []
    for subject in subjects:
        total = Lesson.objects.filter(level__subject=subject).count()
        completed = LearningProgress.objects.filter(
            student=student, lesson__level__subject=subject, is_completed=True
        ).count()
        pct = int((completed / total * 100) if total > 0 else 0)
        subject_progress.append({
            'subject': subject,
            'total': total,
            'completed': completed,
            'pct': pct,
        })

    from gamification.models import XPTransaction
    from datetime import date, timedelta
    xp_over_time = []
    today = date.today()
    running_total = 0
    for i in range(29, -1, -1):
        day = today - timedelta(days=i)
        day_xp = XPTransaction.objects.filter(
            student=student, created_at__date=day, amount__gt=0
        ).values_list('amount', flat=True)
        running_total += sum(day_xp)
        xp_over_time.append({'day': day.strftime('%m/%d'), 'xp': running_total})

    return render(request, 'student/progress.html', {
        'profile': profile,
        'subject_progress': subject_progress,
        'xp_over_time': json.dumps(xp_over_time),
        'xp_progress': profile.get_xp_progress(),
    })


@student_required
def student_settings(request):
    profile = request.user.student_profile

    if request.method == 'POST':
        action = request.POST.get('action')

        if action == 'update_profile':
            request.user.first_name = request.POST.get('first_name', request.user.first_name)
            request.user.last_name = request.POST.get('last_name', request.user.last_name)
            request.user.save()
            profile.school_class = request.POST.get('school_class', profile.school_class)
            profile.bio = request.POST.get('bio', profile.bio)
            profile.theme_preference = request.POST.get('theme', profile.theme_preference)
            if request.FILES.get('avatar'):
                profile.avatar = request.FILES['avatar']
            profile.save()
            return JsonResponse({'success': True, 'message': 'Profile updated!'})

        elif action == 'change_password':
            from django.contrib.auth import update_session_auth_hash
            old_pw = request.POST.get('old_password')
            new_pw = request.POST.get('new_password')
            if not request.user.check_password(old_pw):
                return JsonResponse({'success': False, 'message': 'Current password is incorrect.'})
            if len(new_pw) < 8:
                return JsonResponse({'success': False, 'message': 'Password must be at least 8 characters.'})
            request.user.set_password(new_pw)
            request.user.save()
            update_session_auth_hash(request, request.user)
            return JsonResponse({'success': True, 'message': 'Password changed successfully!'})

    return render(request, 'student/settings.html', {'profile': profile})
