"""
Accounts views: registration, login, logout, email verification,
password reset, teacher portal, admin dashboard.
"""
import json
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.http import JsonResponse
from django.utils import timezone
from django.db.models import Avg, Count, Sum
from django.conf import settings
from functools import wraps

from .models import User, EmailVerification, StudentProfile, TeacherProfile


# ─── Decorators ────────────────────────────────────────────────────────────

def student_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect(f'/login/?next={request.path}')
        if request.user.is_teacher:
            if request.path in ['/student/dashboard/', '/student/progress/', '/student/settings/']:
                return redirect('teacher_dashboard')
            return view_func(request, *args, **kwargs)
        if request.user.is_admin_user:
            if request.path in ['/student/dashboard/', '/student/progress/', '/student/settings/']:
                return redirect('admin_dashboard')
            return view_func(request, *args, **kwargs)
        if not request.user.is_student:
            return redirect('/403/')
        return view_func(request, *args, **kwargs)
    return wrapper


def teacher_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect(f'/login/?next={request.path}')
        if not (request.user.is_teacher or request.user.is_admin_user):
            return redirect('/403/')
        return view_func(request, *args, **kwargs)
    return wrapper


def admin_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect(f'/login/?next={request.path}')
        if not request.user.is_admin_user:
            return redirect('/403/')
        return view_func(request, *args, **kwargs)
    return wrapper


# ─── Helpers ───────────────────────────────────────────────────────────────

def send_verification_email(user, request):
    """Create a verification token and send the email."""
    # Invalidate old tokens
    EmailVerification.objects.filter(user=user, is_used=False).update(is_used=True)

    verification = EmailVerification.objects.create(user=user)
    verify_url = request.build_absolute_uri(f'/verify-email/{verification.token}/')

    subject = 'Verify your Gamified Code Academy email'
    message = (
        f"Hi {user.first_name},\n\n"
        f"Welcome to Gamified Code Academy! Please verify your email by clicking the link below:\n\n"
        f"{verify_url}\n\n"
        f"This link expires in 24 hours.\n\n"
        f"Happy coding! 🚀\n"
        f"The Gamified Code Academy Team"
    )

    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Email send error: {e}")

    return verify_url


# ─── Home Redirect ──────────────────────────────────────────────────────────

def frontend_page(path='/'):
    """Send browser traffic to the React AdaptiveCS app."""
    return redirect(f'{settings.FRONTEND_URL}{path}')


def home_redirect(request):
    if request.user.is_authenticated:
        if request.user.is_student:
            return frontend_page('/dashboard')
        elif request.user.is_teacher:
            return frontend_page('/teacher')
        elif request.user.is_admin_user:
            return frontend_page('/admin')
    return frontend_page('/')


# ─── Registration ───────────────────────────────────────────────────────────

from .services import (
    create_and_send_otp,
    verify_otp_submission,
    validate_verified_session,
    consume_verified_session,
)


# ─── AJAX OTP Endpoints for Registration ──────────────────────────────────────

def send_registration_otp_view(request):
    """
    AJAX endpoint to send OTP to user's email during registration.
    Enforces email validation, duplicate email check, and 60-second cooldown.
    """
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)

    try:
        # Support both JSON payload and form POST
        if request.content_type == 'application/json':
            data = json.loads(request.body)
        else:
            data = request.POST

        email = data.get('email', '').strip().lower()
        full_name = data.get('full_name', '').strip() or data.get('first_name', '').strip()

        if not email:
            return JsonResponse({
                'success': False,
                'code': 'MISSING_EMAIL',
                'message': 'Email address is required.',
            }, status=400)

        # Basic email format check
        if '@' not in email or '.' not in email.split('@')[-1]:
            return JsonResponse({
                'success': False,
                'code': 'INVALID_EMAIL',
                'message': 'Please enter a valid email address.',
            }, status=400)

        # Process OTP generation and email dispatch
        result = create_and_send_otp(email=email, request=request, full_name=full_name)

        if not result.get('success'):
            status_code = 400
            if result.get('code') == 'EMAIL_SEND_FAILED':
                status_code = 500
            return JsonResponse(result, status=status_code)

        return JsonResponse(result, status=200)

    except Exception as exc:
        return JsonResponse({
            'success': False,
            'code': 'SERVER_ERROR',
            'message': f'An unexpected error occurred: {str(exc)}',
        }, status=500)


def verify_registration_otp_view(request):
    """
    AJAX endpoint to verify entered OTP against database record.
    Enforces expiry (5 mins), max 5 attempts, and sets verified session token.
    """
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)

    try:
        if request.content_type == 'application/json':
            data = json.loads(request.body)
        else:
            data = request.POST

        email = data.get('email', '').strip().lower()
        otp_code = data.get('otp', '').strip()

        if not email or not otp_code:
            return JsonResponse({
                'success': False,
                'code': 'MISSING_FIELDS',
                'message': 'Email and OTP code are required.',
            }, status=400)

        result = verify_otp_submission(email=email, entered_otp=otp_code)

        if not result.get('success'):
            return JsonResponse(result, status=400)

        # Store in session as secondary verification layer
        request.session['verified_otp_email'] = email
        request.session['verified_otp_token'] = result.get('session_token')

        return JsonResponse(result, status=200)

    except Exception as exc:
        return JsonResponse({
            'success': False,
            'code': 'SERVER_ERROR',
            'message': f'An unexpected error occurred: {str(exc)}',
        }, status=500)


# ─── Registration ───────────────────────────────────────────────────────────

def register_view(request):
    if request.user.is_authenticated:
        return redirect('student_dashboard')

    if request.method == 'POST':
        data = request.POST
        errors = {}

        # Accept either full_name or first_name + last_name
        full_name = data.get('full_name', '').strip()
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()

        if full_name and not (first_name and last_name):
            parts = full_name.split(None, 1)
            first_name = parts[0]
            last_name = parts[1] if len(parts) > 1 else ''

        username = data.get('username', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        confirm_password = data.get('confirm_password', '')
        dob = data.get('date_of_birth', '') or None
        school_class = data.get('school_class', '').strip()
        terms = data.get('terms', '')
        session_token = data.get('session_token', '').strip() or request.session.get('verified_otp_token', '')

        # Auto-generate username from email or name if not explicitly provided
        if not username:
            if email:
                base_user = email.split('@')[0]
                candidate = base_user
                counter = 1
                while User.objects.filter(username=candidate).exists():
                    candidate = f"{base_user}{counter}"
                    counter += 1
                username = candidate
            else:
                errors['username'] = 'Username is required.'

        if not first_name:
            errors['first_name'] = 'First name (or Full Name) is required.'
        if not username:
            errors['username'] = 'Username is required.'
        elif len(username) < 3:
            errors['username'] = 'Username must be at least 3 characters.'
        elif User.objects.filter(username=username).exists():
            errors['username'] = 'This username is already taken.'

        if not email:
            errors['email'] = 'Email is required.'
        elif User.objects.filter(email=email).exists():
            errors['email'] = 'An account with this email already exists.'

        # OTP Verification check
        is_verified = False
        if email and session_token and validate_verified_session(email, session_token):
            is_verified = True
        elif request.session.get('verified_otp_email') == email and request.session.get('verified_otp_token'):
            if validate_verified_session(email, request.session.get('verified_otp_token')):
                is_verified = True

        if not is_verified:
            errors['email_otp'] = 'Please verify your email address with the OTP before completing registration.'

        if not password:
            errors['password'] = 'Password is required.'
        elif len(password) < 8:
            errors['password'] = 'Password must be at least 8 characters.'
        if password != confirm_password:
            errors['confirm_password'] = 'Passwords do not match.'
        if not terms:
            errors['terms'] = 'You must accept the Terms and Conditions.'

        if errors:
            form_dict = dict(data)
            form_dict['full_name'] = full_name or f"{first_name} {last_name}".strip()
            return render(request, 'accounts/register.html', {
                'errors': errors,
                'form_data': form_dict,
                'email_is_verified': is_verified,
            })


        # Create user with verified email
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=User.Role.STUDENT,
            is_email_verified=True,
            is_active=True,
        )

        # Create student profile
        profile = StudentProfile.objects.create(
            user=user,
            school_class=school_class,
        )
        if dob:
            try:
                from datetime import date
                profile.date_of_birth = date.fromisoformat(dob)
                profile.save()
            except ValueError:
                pass

        # Handle avatar
        if request.FILES.get('avatar'):
            profile.avatar = request.FILES['avatar']
            profile.save()

        # Invalidate the verified OTP record to prevent replay
        if session_token:
            consume_verified_session(email, session_token)
        request.session.pop('verified_otp_email', None)
        request.session.pop('verified_otp_token', None)

        # Automatically authenticate and log in the user
        login(request, user)
        messages.success(request, f"Welcome to Gamified Code Academy, {user.first_name}! Your email is verified.")

        return render(request, 'accounts/register_success.html', {
            'email': email,
            'user': user,
            'debug': settings.DEBUG,
        })

    return render(request, 'accounts/register.html', {
        'form_data': {},
        'errors': {},
        'email_is_verified': False,
    })




# ─── Email Verification ──────────────────────────────────────────────────────

def verify_email(request, token):
    try:
        verification = EmailVerification.objects.select_related('user').get(token=token)
    except EmailVerification.DoesNotExist:
        return render(request, 'accounts/verify_email.html', {'status': 'invalid'})

    if not verification.is_valid:
        return render(request, 'accounts/verify_email.html', {
            'status': 'expired',
            'email': verification.user.email,
        })

    verification.is_used = True
    verification.save()
    verification.user.is_email_verified = True
    verification.user.save()

    return render(request, 'accounts/verify_email.html', {'status': 'success'})


def resend_verification(request):
    if request.method == 'POST':
        email = request.POST.get('email', '').strip().lower()
        try:
            user = User.objects.get(email=email)
            if not user.is_email_verified:
                verify_url = send_verification_email(user, request)
                return JsonResponse({
                    'success': True,
                    'message': 'Verification email sent! Check your inbox.',
                    'verification_url': verify_url,
                })
            else:
                return JsonResponse({'success': False, 'message': 'Email is already verified.'})
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'No account found with this email.'})
    return JsonResponse({'success': False, 'message': 'Invalid request.'})


# ─── Login ──────────────────────────────────────────────────────────────────

def login_view(request):
    """Old Django login page is retired; use the React role-based login."""
    return frontend_page('/login')


# ─── Logout ──────────────────────────────────────────────────────────────────

def logout_view(request):
    logout(request)
    return frontend_page('/login')


# ─── Password Reset ──────────────────────────────────────────────────────────

def forgot_password(request):
    if request.method == 'POST':
        email = request.POST.get('email', '').strip().lower()
        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_url = request.build_absolute_uri(f'/reset-password/{uid}/{token}/')

            send_mail(
                'Reset your Gamified Code Academy password',
                f"Hi {user.first_name},\n\nReset your password here:\n{reset_url}\n\nThis link expires in 2 hours.",
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=True,
            )
        except User.DoesNotExist:
            pass  # Don't reveal whether email exists

        return render(request, 'accounts/forgot_password.html', {'sent': True})

    return render(request, 'accounts/forgot_password.html')


def reset_password(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is None or not default_token_generator.check_token(user, token):
        return render(request, 'accounts/reset_password.html', {'invalid': True})

    if request.method == 'POST':
        password = request.POST.get('password', '')
        confirm = request.POST.get('confirm_password', '')

        if len(password) < 8:
            return render(request, 'accounts/reset_password.html', {
                'error': 'Password must be at least 8 characters.',
                'uidb64': uidb64, 'token': token,
            })
        if password != confirm:
            return render(request, 'accounts/reset_password.html', {
                'error': 'Passwords do not match.',
                'uidb64': uidb64, 'token': token,
            })

        user.set_password(password)
        user.save()
        return render(request, 'accounts/reset_password.html', {'success': True})

    return render(request, 'accounts/reset_password.html', {'uidb64': uidb64, 'token': token})


# ─── Public Profile ──────────────────────────────────────────────────────────

@login_required
def public_profile(request, username):
    profile_user = get_object_or_404(User, username=username)
    profile = get_object_or_404(StudentProfile, user=profile_user)
    achievements = profile_user.student_achievements.select_related('achievement').order_by('-unlocked_at')[:12]
    recent_submissions = profile_user.submissions.select_related('challenge', 'language').order_by('-submitted_at')[:10]

    return render(request, 'student/profile.html', {
        'profile_user': profile_user,
        'profile': profile,
        'achievements': achievements,
        'recent_submissions': recent_submissions,
        'xp_progress': profile.get_xp_progress(),
    })


# ─── Teacher Portal ──────────────────────────────────────────────────────────

@teacher_required
def teacher_dashboard(request):
    from curriculum.models import Lesson, Quiz
    from coding.models import CodingChallenge, Submission
    from accounts.models import User as U

    student_count = U.objects.filter(role='STUDENT').count()
    lesson_count = Lesson.objects.count()
    quiz_count = Quiz.objects.count()
    challenge_count = CodingChallenge.objects.count()

    top_students = U.objects.filter(role='STUDENT').select_related('student_profile').order_by('-student_profile__total_xp')[:6]

    recent_submissions = Submission.objects.select_related(
        'student', 'challenge', 'language'
    ).order_by('-submitted_at')[:10]

    return render(request, 'teacher/dashboard.html', {
        'total_students': student_count,
        'student_count': student_count,
        'total_lessons': lesson_count,
        'lesson_count': lesson_count,
        'total_quizzes': quiz_count,
        'quiz_count': quiz_count,
        'total_challenges': challenge_count,
        'challenge_count': challenge_count,
        'top_students': top_students,
        'recent_submissions': recent_submissions,
    })



@teacher_required
def teacher_lessons(request):
    from curriculum.models import Lesson
    lessons = Lesson.objects.select_related('level__subject').order_by('-created_at')
    return render(request, 'teacher/lessons.html', {'lessons': lessons})


@teacher_required
def teacher_lesson_create(request):
    from curriculum.models import Level
    levels = Level.objects.select_related('subject').order_by('subject__name', 'number')

    if request.method == 'POST':
        from curriculum.models import Lesson
        lesson = Lesson.objects.create(
            level_id=request.POST.get('level'),
            title=request.POST.get('title'),
            description=request.POST.get('description', ''),
            content=request.POST.get('content', ''),
            code_example=request.POST.get('code_example', ''),
            code_language=request.POST.get('code_language', 'python'),
            xp_reward=int(request.POST.get('xp_reward', 20)),
            order=int(request.POST.get('order', 0)),
        )
        messages.success(request, f'Lesson "{lesson.title}" created successfully!')
        return redirect('teacher_lessons')

    return render(request, 'teacher/lesson_form.html', {'levels': levels, 'action': 'Create'})


@teacher_required
def teacher_lesson_edit(request, pk):
    from curriculum.models import Lesson, Level
    lesson = get_object_or_404(Lesson, pk=pk)
    levels = Level.objects.select_related('subject').order_by('subject__name', 'number')

    if request.method == 'POST':
        lesson.level_id = request.POST.get('level')
        lesson.title = request.POST.get('title')
        lesson.description = request.POST.get('description', '')
        lesson.content = request.POST.get('content', '')
        lesson.code_example = request.POST.get('code_example', '')
        lesson.code_language = request.POST.get('code_language', 'python')
        lesson.xp_reward = int(request.POST.get('xp_reward', 20))
        lesson.order = int(request.POST.get('order', 0))
        lesson.save()
        messages.success(request, f'Lesson "{lesson.title}" updated!')
        return redirect('teacher_lessons')

    return render(request, 'teacher/lesson_form.html', {
        'lesson': lesson, 'levels': levels, 'action': 'Edit'
    })


@teacher_required
def teacher_quizzes(request):
    from curriculum.models import Quiz
    quizzes = Quiz.objects.select_related('lesson__level__subject').annotate(
        question_count=Count('questions')
    ).order_by('-created_at')
    return render(request, 'teacher/quizzes.html', {'quizzes': quizzes})


@teacher_required
def teacher_quiz_create(request):
    from curriculum.models import Level, Lesson, Quiz, Question
    levels = Level.objects.select_related('subject').order_by('subject__name', 'number')
    lessons = Lesson.objects.select_related('level__subject').order_by('level__subject__name', 'title')

    if request.method == 'POST':
        quiz = Quiz.objects.create(
            title=request.POST.get('title'),
            description=request.POST.get('description', ''),
            difficulty=request.POST.get('difficulty', 'BEGINNER'),
            xp_reward=int(request.POST.get('xp_reward', 50)),
            time_limit_minutes=int(request.POST.get('time_limit', 10)),
            lesson_id=request.POST.get('lesson') or None,
            level_id=request.POST.get('level') or None,
        )

        # Parse questions from JSON
        questions_json = request.POST.get('questions_json', '[]')
        try:
            questions = json.loads(questions_json)
            for i, q in enumerate(questions):
                Question.objects.create(
                    quiz=quiz,
                    text=q.get('text', ''),
                    question_type=q.get('type', 'MCQ'),
                    code_snippet=q.get('code_snippet', ''),
                    option_a=q.get('option_a', ''),
                    option_b=q.get('option_b', ''),
                    option_c=q.get('option_c', ''),
                    option_d=q.get('option_d', ''),
                    correct_answer=q.get('correct_answer', 'A'),
                    explanation=q.get('explanation', ''),
                    points=int(q.get('points', 10)),
                    order=i,
                )
        except json.JSONDecodeError:
            pass

        messages.success(request, f'Quiz "{quiz.title}" created with {quiz.get_question_count()} questions!')
        return redirect('teacher_quizzes')

    return render(request, 'teacher/quiz_form.html', {
        'levels': levels, 'lessons': lessons, 'action': 'Create'
    })


@teacher_required
def teacher_quiz_edit(request, pk):
    from curriculum.models import Quiz, Question, Level, Lesson
    quiz = get_object_or_404(Quiz, pk=pk)
    levels = Level.objects.select_related('subject').order_by('subject__name', 'number')
    lessons = Lesson.objects.select_related('level__subject').order_by('title')

    if request.method == 'POST':
        quiz.title = request.POST.get('title')
        quiz.description = request.POST.get('description', '')
        quiz.difficulty = request.POST.get('difficulty', 'BEGINNER')
        quiz.xp_reward = int(request.POST.get('xp_reward', 50))
        quiz.time_limit_minutes = int(request.POST.get('time_limit', 10))
        quiz.lesson_id = request.POST.get('lesson') or None
        quiz.level_id = request.POST.get('level') or None
        quiz.save()

        questions_json = request.POST.get('questions_json', '[]')
        try:
            questions = json.loads(questions_json)
            quiz.questions.all().delete()
            for i, q in enumerate(questions):
                Question.objects.create(
                    quiz=quiz, text=q.get('text', ''), question_type=q.get('type', 'MCQ'),
                    code_snippet=q.get('code_snippet', ''), option_a=q.get('option_a', ''),
                    option_b=q.get('option_b', ''), option_c=q.get('option_c', ''),
                    option_d=q.get('option_d', ''), correct_answer=q.get('correct_answer', 'A'),
                    explanation=q.get('explanation', ''), points=int(q.get('points', 10)), order=i,
                )
        except json.JSONDecodeError:
            pass

        messages.success(request, f'Quiz "{quiz.title}" updated!')
        return redirect('teacher_quizzes')

    questions_data = list(quiz.questions.values(
        'id', 'text', 'question_type', 'code_snippet',
        'option_a', 'option_b', 'option_c', 'option_d',
        'correct_answer', 'explanation', 'points', 'order'
    ))
    return render(request, 'teacher/quiz_form.html', {
        'quiz': quiz, 'questions_data': json.dumps(questions_data),
        'levels': levels, 'lessons': lessons, 'action': 'Edit'
    })


@teacher_required
def teacher_challenges(request):
    from coding.models import CodingChallenge
    challenges = CodingChallenge.objects.select_related('subject', 'language').annotate(
        test_count=Count('test_cases'),
        submission_count=Count('submissions')
    ).order_by('-created_at')
    return render(request, 'teacher/challenges.html', {'challenges': challenges})


@teacher_required
def teacher_challenge_create(request):
    from coding.models import CodingChallenge, TestCase
    from subjects.models import Subject, ProgrammingLanguage
    from curriculum.models import Level

    subjects = Subject.objects.filter(is_active=True)
    languages = ProgrammingLanguage.objects.filter(is_active=True)
    levels = Level.objects.select_related('subject').order_by('subject__name', 'number')

    if request.method == 'POST':
        from django.utils.text import slugify
        title = request.POST.get('title', '')
        slug = slugify(title)
        counter = 1
        while CodingChallenge.objects.filter(slug=slug).exists():
            slug = f"{slugify(title)}-{counter}"
            counter += 1

        challenge = CodingChallenge.objects.create(
            title=title,
            slug=slug,
            description=request.POST.get('description', ''),
            subject_id=request.POST.get('subject'),
            language_id=request.POST.get('language') or None,
            level_id=request.POST.get('level') or None,
            difficulty=request.POST.get('difficulty', 'EASY'),
            xp_reward=int(request.POST.get('xp_reward', 100)),
            input_format=request.POST.get('input_format', ''),
            output_format=request.POST.get('output_format', ''),
            constraints=request.POST.get('constraints', ''),
            examples=request.POST.get('examples', ''),
            hints=request.POST.get('hints', ''),
            starter_code=request.POST.get('starter_code', ''),
            time_limit_seconds=int(request.POST.get('time_limit', 10)),
            memory_limit_mb=int(request.POST.get('memory_limit', 128)),
            created_by=request.user,
        )

        # Parse test cases
        test_cases_json = request.POST.get('test_cases_json', '[]')
        try:
            test_cases = json.loads(test_cases_json)
            for i, tc in enumerate(test_cases):
                TestCase.objects.create(
                    challenge=challenge,
                    input_data=tc.get('input', ''),
                    expected_output=tc.get('output', ''),
                    is_hidden=tc.get('is_hidden', False),
                    order=i,
                )
        except json.JSONDecodeError:
            pass

        messages.success(request, f'Challenge "{challenge.title}" created!')
        return redirect('teacher_challenges')

    return render(request, 'teacher/challenge_form.html', {
        'subjects': subjects, 'languages': languages, 'levels': levels, 'action': 'Create'
    })


@teacher_required
def teacher_challenge_edit(request, pk):
    from coding.models import CodingChallenge, TestCase
    from subjects.models import Subject, ProgrammingLanguage
    from curriculum.models import Level

    challenge = get_object_or_404(CodingChallenge, pk=pk)
    subjects = Subject.objects.filter(is_active=True)
    languages = ProgrammingLanguage.objects.filter(is_active=True)
    levels = Level.objects.select_related('subject').order_by('subject__name', 'number')

    if request.method == 'POST':
        challenge.title = request.POST.get('title', '')
        challenge.description = request.POST.get('description', '')
        challenge.subject_id = request.POST.get('subject')
        challenge.language_id = request.POST.get('language') or None
        challenge.level_id = request.POST.get('level') or None
        challenge.difficulty = request.POST.get('difficulty', 'EASY')
        challenge.xp_reward = int(request.POST.get('xp_reward', 100))
        challenge.input_format = request.POST.get('input_format', '')
        challenge.output_format = request.POST.get('output_format', '')
        challenge.constraints = request.POST.get('constraints', '')
        challenge.examples = request.POST.get('examples', '')
        challenge.hints = request.POST.get('hints', '')
        challenge.starter_code = request.POST.get('starter_code', '')
        challenge.save()

        test_cases_json = request.POST.get('test_cases_json', '[]')
        try:
            test_cases = json.loads(test_cases_json)
            challenge.test_cases.all().delete()
            for i, tc in enumerate(test_cases):
                TestCase.objects.create(
                    challenge=challenge, input_data=tc.get('input', ''),
                    expected_output=tc.get('output', ''), is_hidden=tc.get('is_hidden', False), order=i,
                )
        except json.JSONDecodeError:
            pass

        messages.success(request, f'Challenge "{challenge.title}" updated!')
        return redirect('teacher_challenges')

    test_cases_data = list(challenge.test_cases.values('input_data', 'expected_output', 'is_hidden', 'order'))
    return render(request, 'teacher/challenge_form.html', {
        'challenge': challenge, 'test_cases_data': json.dumps(test_cases_data),
        'subjects': subjects, 'languages': languages, 'levels': levels, 'action': 'Edit'
    })


@teacher_required
def teacher_students(request):
    from accounts.models import User as U, StudentProfile
    students = U.objects.filter(role='STUDENT').select_related('student_profile').order_by('-student_profile__total_xp')
    profiles = StudentProfile.objects.select_related('user').order_by('-total_xp')
    return render(request, 'teacher/students.html', {
        'students': students,
        'profiles': profiles,
    })



@teacher_required
def teacher_competition_create(request):
    from competitions.models import Competition
    from coding.models import CodingChallenge

    challenges = CodingChallenge.objects.filter(is_active=True)

    if request.method == 'POST':
        from django.utils.text import slugify
        name = request.POST.get('name', '')
        slug = slugify(name)
        counter = 1
        while Competition.objects.filter(slug=slug).exists():
            slug = f"{slugify(name)}-{counter}"
            counter += 1

        competition = Competition.objects.create(
            name=name,
            slug=slug,
            description=request.POST.get('description', ''),
            start_time=request.POST.get('start_time'),
            end_time=request.POST.get('end_time'),
            xp_reward_1st=int(request.POST.get('xp_1st', 500)),
            xp_reward_2nd=int(request.POST.get('xp_2nd', 300)),
            xp_reward_3rd=int(request.POST.get('xp_3rd', 200)),
            xp_reward_participant=int(request.POST.get('xp_participant', 50)),
            created_by=request.user,
        )
        messages.success(request, f'Competition "{competition.name}" created!')
        return redirect('teacher_dashboard')

    return render(request, 'teacher/competition_form.html', {'challenges': challenges})


# ─── Admin Dashboard ─────────────────────────────────────────────────────────

@admin_required
def admin_dashboard(request):
    from subjects.models import Subject
    from curriculum.models import Lesson, Quiz
    from coding.models import CodingChallenge
    from competitions.models import Competition
    from gamification.models import XPTransaction

    stats = {
        'total_students': User.objects.filter(role='STUDENT').count(),
        'total_teachers': User.objects.filter(role='TEACHER').count(),
        'total_subjects': Subject.objects.count(),
        'total_lessons': Lesson.objects.count(),
        'total_quizzes': Quiz.objects.count(),
        'total_challenges': CodingChallenge.objects.count(),
        'total_competitions': Competition.objects.count(),
        'total_xp': XPTransaction.objects.filter(amount__gt=0).aggregate(Sum('amount'))['amount__sum'] or 0,
    }

    recent_users = User.objects.filter(role='STUDENT').order_by('-date_joined')[:10]

    return render(request, 'admin_portal/dashboard.html', {
        'stats': stats,
        'recent_users': recent_users,
    })


@admin_required
def admin_users(request):
    role_filter = request.GET.get('role', 'STUDENT')
    users = User.objects.filter(role=role_filter).select_related(
        'student_profile'
    ).order_by('-date_joined')
    return render(request, 'admin_portal/users.html', {
        'users': users,
        'role_filter': role_filter,
    })


# ─── Error Handlers ──────────────────────────────────────────────────────────

def error_404(request, exception=None):
    return render(request, 'errors/404.html', status=404)


def error_403(request, exception=None):
    return render(request, 'errors/403.html', status=403)


def error_500(request):
    return render(request, 'errors/500.html', status=500)
