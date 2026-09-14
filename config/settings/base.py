"""
Base Django settings for Gamified Code Academy & AI-Powered Adaptive CS Platform.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load environment variables
load_dotenv(BASE_DIR / '.env')

# Security
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-change-me-in-production-!@#$%^&*()')

ALLOWED_HOSTS = ['*']
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Custom user model
AUTH_USER_MODEL = 'accounts.User'

# Application definition
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'crispy_forms',
    'crispy_bootstrap5',
]

LOCAL_APPS = [
    'accounts',
    'subjects',
    'curriculum',
    'assessments',
    'coding',
    'competitions',
    'gamification',
    'analytics',
    'ai_engine',
    'ai_services',
    'progress',
    'notifications',
    'teachers',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'notifications.context_processors.notifications_processor',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', 'OPTIONS': {'min_length': 8}},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Authentication — browser login lives in the React app
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173').rstrip('/')
LOGIN_URL = f'{FRONTEND_URL}/login'
LOGIN_REDIRECT_URL = FRONTEND_URL
LOGOUT_REDIRECT_URL = f'{FRONTEND_URL}/login'

# Django REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
}

# CORS Configuration
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

# Crispy forms
CRISPY_ALLOWED_TEMPLATE_PACKS = 'bootstrap5'
CRISPY_TEMPLATE_PACK = 'bootstrap5'

# Session
SESSION_COOKIE_AGE = 1209600  # 2 weeks

# Email verification token expiry (hours)
EMAIL_VERIFICATION_EXPIRY_HOURS = 24
PASSWORD_RESET_EXPIRY_HOURS = 2

# Real-time Email OTP Configuration
OTP_EXPIRY_MINUTES = int(os.environ.get('OTP_EXPIRY_MINUTES', 5))
OTP_MAX_ATTEMPTS = int(os.environ.get('OTP_MAX_ATTEMPTS', 5))
OTP_COOLDOWN_SECONDS = int(os.environ.get('OTP_COOLDOWN_SECONDS', 60))
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'noreply@adaptive-cs-edu.internal')

# XP level thresholds
XP_LEVELS = [
    (1, 0),
    (2, 500),
    (3, 1200),
    (4, 2500),
    (5, 5000),
    (6, 9000),
    (7, 15000),
    (8, 25000),
    (9, 40000),
    (10, 60000),
]

# Official LLM Configuration
LLM_PROVIDER = os.environ.get('LLM_PROVIDER', 'openai')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')
OPENAI_MODEL = os.environ.get('OPENAI_MODEL', 'gpt-4o-mini')
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', os.environ.get('GOOGLE_AI_API_KEY', ''))
GEMINI_MODEL = os.environ.get('GEMINI_MODEL', 'gemini-1.5-flash')

# Code execution settings
CODE_EXECUTION_TIMEOUT = 10  # seconds
CODE_EXECUTION_MAX_MEMORY = 128  # MB
