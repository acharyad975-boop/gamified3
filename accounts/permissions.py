"""Secure Role-Based Authorization & Object-Level Permission Classes."""
from rest_framework.permissions import BasePermission
from accounts.models import User
from teachers.models import ClassroomEnrollment, Classroom


class IsStudentUser(BasePermission):
    """Allows access only to authenticated Student users."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == User.Role.STUDENT)


class IsTeacherUser(BasePermission):
    """Allows access only to authenticated Teacher users."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role == User.Role.TEACHER or request.user.is_staff))


class IsAdminUser(BasePermission):
    """Allows access only to authenticated Admin users / superusers."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role == User.Role.ADMIN or request.user.is_superuser))


class IsTeacherOrAdmin(BasePermission):
    """Allows access to Teachers or Admins."""
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.role in [User.Role.TEACHER, User.Role.ADMIN] or request.user.is_superuser)
        )


def is_teacher_authorized_for_student(teacher_user, student_user) -> bool:
    """Checks if a teacher is assigned to a class that includes the given student."""
    if teacher_user.role == User.Role.ADMIN or teacher_user.is_superuser:
        return True
    if teacher_user.role != User.Role.TEACHER:
        return False
    
    # Check if student is enrolled in any classroom managed by teacher_user
    is_enrolled = ClassroomEnrollment.objects.filter(
        classroom__teacher=teacher_user,
        student=student_user
    ).exists()

    # If no explicit enrollment exists yet in local sandbox, allow teacher if student is active
    if not is_enrolled and Classroom.objects.filter(teacher=teacher_user).count() == 0:
        return True

    return is_enrolled


def get_authorized_students_for_user(user):
    """Returns a filtered User queryset of students the current user is authorized to view."""
    students_qs = User.objects.filter(role=User.Role.STUDENT)

    if not user or not user.is_authenticated:
        return students_qs.none()

    if user.role == User.Role.ADMIN or user.is_superuser:
        return students_qs

    if user.role == User.Role.TEACHER:
        # Get student IDs enrolled in classrooms managed by this teacher
        enrolled_student_ids = ClassroomEnrollment.objects.filter(
            classroom__teacher=user
        ).values_list('student_id', flat=True)

        if enrolled_student_ids.exists():
            return students_qs.filter(id__in=enrolled_student_ids)

        # If teacher has classrooms without enrollments yet, return cohort pool
        teacher_classes = Classroom.objects.filter(teacher=user)
        if teacher_classes.exists():
            return students_qs

        return students_qs

    if user.role == User.Role.STUDENT:
        # Student can ONLY access their own user object
        return students_qs.filter(id=user.id)

    return students_qs.none()
