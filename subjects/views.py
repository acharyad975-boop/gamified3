"""Subjects views."""
from django.shortcuts import render
from subjects.models import Subject


def subject_list(request):
    subjects = Subject.objects.filter(is_active=True).order_by('order', 'name')
    return render(request, 'student/subject_list.html', {'subjects': subjects})
