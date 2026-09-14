"""REST API Views for Authentication & Student Profiles."""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from .models import User, StudentProfile


class APIRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        username = data.get('username') or data.get('email')
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name', '')
        educational_year = data.get('educational_year', 'Year 1')
        current_semester = data.get('current_semester', 'Semester 1')
        programming_experience = data.get('programming_experience', 'Beginner')
        interests = data.get('interests', [])

        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email__iexact=email).exists():
            return Response({'error': 'A user with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        # Split full name into first and last name
        names = full_name.strip().split(' ', 1)
        first_name = names[0] if names else ''
        last_name = names[1] if len(names) > 1 else ''

        # Ensure unique username
        base_username = email.split('@')[0]
        final_username = base_username
        counter = 1
        while User.objects.filter(username=final_username).exists():
            final_username = f"{base_username}{counter}"
            counter += 1

        req_role = data.get('role', 'STUDENT').upper()
        assigned_role = User.Role.TEACHER if req_role == 'TEACHER' else User.Role.STUDENT

        user = User.objects.create_user(
            username=final_username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=assigned_role,
            is_email_verified=True
        )

        profile, _ = StudentProfile.objects.get_or_create(
            user=user,
            defaults={
                'educational_year': educational_year,
                'current_semester': current_semester,
                'programming_experience': programming_experience,
                'interests': interests if isinstance(interests, list) else [interests]
            }
        )

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'message': 'Registration successful.',
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.get_full_name() or user.username,
                'role': user.role,
                'educational_year': profile.educational_year,
                'current_semester': profile.current_semester,
                'programming_experience': profile.programming_experience,
                'interests': profile.interests,
            }
        }, status=status.HTTP_201_CREATED)


class APILoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email_or_username = request.data.get('email') or request.data.get('username')
        password = request.data.get('password')

        if not email_or_username or not password:
            return Response({'error': 'Email/Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = None
        if '@' in email_or_username:
            user_obj = User.objects.filter(email__iexact=email_or_username).first()
            if user_obj:
                user = authenticate(request, username=user_obj.username, password=password)
        else:
            user = authenticate(request, username=email_or_username, password=password)

        if not user:
            return Response({'error': 'Invalid email/username or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        expected_role = (request.data.get('role') or '').strip().upper()
        if expected_role:
            if expected_role not in (User.Role.ADMIN, User.Role.TEACHER, User.Role.STUDENT):
                return Response({'error': 'Invalid role portal.'}, status=status.HTTP_400_BAD_REQUEST)
            actual_role = user.role
            if user.is_superuser and actual_role != User.Role.ADMIN:
                actual_role = User.Role.ADMIN
            if actual_role != expected_role:
                return Response(
                    {
                        'error': (
                            f'This account is registered as {actual_role}. '
                            f'Sign in through the {actual_role} portal.'
                        )
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

        token, _ = Token.objects.get_or_create(user=user)
        login(request, user)

        profile = getattr(user, 'student_profile', None)

        return Response({
            'message': 'Login successful.',
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.get_full_name() or user.username,
                'role': user.role,
                'educational_year': profile.educational_year if profile else '',
                'current_semester': profile.current_semester if profile else '',
                'programming_experience': profile.programming_experience if profile else '',
                'interests': profile.interests if profile else [],
                'total_xp': profile.total_xp if profile else 0,
                'current_level': profile.current_level if profile else 1,
            }
        })


class APILogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if hasattr(request.user, 'auth_token'):
            request.user.auth_token.delete()
        logout(request)
        return Response({'message': 'Logged out successfully.'})


class APICurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = getattr(user, 'student_profile', None)
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'full_name': user.get_full_name() or user.username,
            'role': user.role,
            'educational_year': profile.educational_year if profile else '',
            'current_semester': profile.current_semester if profile else '',
            'programming_experience': profile.programming_experience if profile else '',
            'interests': profile.interests if profile else [],
            'total_xp': profile.total_xp if profile else 0,
            'current_level': profile.current_level if profile else 1,
        })
