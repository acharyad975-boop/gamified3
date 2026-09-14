"""Ensure role-based accounts exist in database."""
import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
import django
django.setup()

from accounts.models import User, StudentProfile

def ensure_role_accounts():
    accounts = [
        {
            'username': 'student_demo',
            'email': 'student@example.com',
            'password': 'Password123!',
            'first_name': 'Alex',
            'last_name': 'Rivera',
            'role': User.Role.STUDENT
        },
        {
            'username': 'teacher_demo',
            'email': 'teacher@example.com',
            'password': 'Password123!',
            'first_name': 'Professor',
            'last_name': 'Vance',
            'role': User.Role.TEACHER
        },
        {
            'username': 'admin_demo',
            'email': 'admin@example.com',
            'password': 'Password123!',
            'first_name': 'System',
            'last_name': 'Admin',
            'role': User.Role.ADMIN
        },
    ]

    for acc in accounts:
        user = User.objects.filter(email=acc['email']).first()
        if not user:
            user = User.objects.create_user(
                username=acc['username'],
                email=acc['email'],
                password=acc['password'],
                first_name=acc['first_name'],
                last_name=acc['last_name'],
                role=acc['role'],
                is_email_verified=True
            )
            print(f"Created {acc['role']} user: {acc['email']}")
        else:
            user.role = acc['role']
            user.set_password(acc['password'])
            user.save()
            print(f"Updated {acc['role']} user: {acc['email']}")

        if acc['role'] == User.Role.STUDENT:
            StudentProfile.objects.get_or_create(
                user=user,
                defaults={
                    'educational_year': 'Year 1',
                    'current_semester': 'Semester 1',
                    'programming_experience': 'Beginner',
                    'interests': ['Python Programming', 'Algorithms']
                }
            )

if __name__ == '__main__':
    ensure_role_accounts()
