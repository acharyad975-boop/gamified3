"""Main URL configuration."""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('django-admin/', admin.site.urls),

    # REST APIs for modern React Frontend
    path('api/auth/', include('accounts.api_urls')),
    path('api/games/', include('gamification.api_urls')),
    path('api/assessments/', include('assessments.urls')),
    path('api/ai/', include('ai_engine.urls')),
    path('api/progress/', include('progress.urls')),
    path('api/ai-legacy/', include('ai_services.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/teacher/', include('teachers.urls')),
    path('api/admin-api/', include('accounts.admin_urls')),

    # Legacy template routes preserved for backward compatibility
    path('', include('accounts.urls')),
    path('student/', include('curriculum.urls')),
    path('student/', include('coding.urls')),
    path('student/', include('gamification.urls')),
    path('competitions/', include('competitions.urls')),
    path('subjects/', include('subjects.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Custom error handlers
handler404 = 'accounts.views.error_404'
handler403 = 'accounts.views.error_403'
handler500 = 'accounts.views.error_500'
