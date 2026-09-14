"""Context processors for global template variables."""
from notifications.models import Notification


def global_context(request):
    """Inject global vars into every template."""
    ctx = {}
    if request.user.is_authenticated:
        unread_count = Notification.objects.filter(user=request.user, is_read=False).count()
        recent_notifs = Notification.objects.filter(user=request.user).order_by('-created_at')[:5]
        ctx['unread_notifications_count'] = unread_count
        ctx['recent_notifications'] = recent_notifs
    else:
        ctx['unread_notifications_count'] = 0
        ctx['recent_notifications'] = []
    return ctx
