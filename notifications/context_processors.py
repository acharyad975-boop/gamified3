"""Context processor to inject notifications into all templates."""


def notifications_processor(request):
    """Add unread notification count to all template contexts."""
    if request.user.is_authenticated:
        try:
            from notifications.models import Notification
            unread_count = Notification.objects.filter(
                user=request.user, is_read=False
            ).count()
            recent_notifications = Notification.objects.filter(
                user=request.user
            ).order_by('-created_at')[:5]
            return {
                'unread_notifications_count': unread_count,
                'recent_notifications': recent_notifications,
            }
        except Exception:
            pass
    return {
        'unread_notifications_count': 0,
        'recent_notifications': [],
    }
