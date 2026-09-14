"""Development settings."""
from .base import *

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Email configuration (SMTP with Gmail or console backend fallback)
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', 'True').lower() in ('true', '1', 'yes')
EMAIL_USE_SSL = os.environ.get('EMAIL_USE_SSL', 'False').lower() in ('true', '1', 'yes')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER or 'noreply@gamifiedcodeacademy.com')

# Automatically use SMTP backend if credentials are configured in .env, otherwise console for testing
default_backend = (
    'django.core.mail.backends.smtp.EmailBackend'
    if (EMAIL_HOST_USER and EMAIL_HOST_PASSWORD)
    else 'django.core.mail.backends.console.EmailBackend'
)
EMAIL_BACKEND = os.environ.get('EMAIL_BACKEND', default_backend)


# Development: allow all hosts
ALLOWED_HOSTS = ['*']

# Use standard staticfiles storage in development to avoid manifest requirement
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'


# Django debug toolbar (optional, comment out if not installed)
# INSTALLED_APPS += ['debug_toolbar']
