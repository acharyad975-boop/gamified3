"""Notifications views."""
import json
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Notification


@login_required
def notifications_list(request):
    notifications = Notification.objects.filter(user=request.user).order_by('-created_at')[:50]
    # Mark all as read
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return render(request, 'student/notifications.html', {'notifications': notifications})


@login_required
def mark_read(request, notification_id):
    Notification.objects.filter(pk=notification_id, user=request.user).update(is_read=True)
    return JsonResponse({'success': True})


@login_required
def mark_all_read(request):
    if request.method == 'POST':
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return JsonResponse({'success': True})
    return JsonResponse({'error': 'POST required'}, status=405)
