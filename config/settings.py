"""
Django settings for config project.
"""
import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env file
load_dotenv(BASE_DIR / '.env')

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-v+cbq$jndd-+6hynr&49i73*h6k8)ren&2_0&v26*4_(9oy8@h')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'crispy_forms',
    'crispy_bootstrap5',
    
    # Custom apps
    'accounts.apps.AccountsConfig',
    'subjects.apps.SubjectsConfig',
    'curriculum.apps.CurriculumConfig',
    'assessments.apps.AssessmentsConfig',
    'coding.apps.CodingConfig',
    'gamification.apps.GamificationConfig',
    'analytics.apps.AnalyticsConfig',
    'ai_engine.apps.AiEngineConfig',
    'ai_services.apps.AiServicesConfig',
    'progress.apps.ProgressConfig',
    'notifications.apps.NotificationsConfig',
    'competitions.apps.CompetitionsConfig',
]

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
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# Uses PostgreSQL on Render (via DATABASE_URL env var), falls back to SQLite locally
DATABASES = {
    'default': dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=600,
    )
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']

# WhiteNoise — serve compressed static files efficiently
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files (User uploads)
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom settings
XP_LEVELS = [
    (1, 0),
    (2, 500),
    (3, 1500),
    (4, 3000),
    (5, 5000),
    (6, 8000),
    (7, 12000),
    (8, 17000),
    (9, 23000),
    (10, 30000),
    (11, 40000),
    (12, 50000),
]

# Email configuration
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_VERIFICATION_EXPIRY_HOURS = 24

# Auth settings
AUTH_USER_MODEL = 'accounts.User'
LOGIN_URL = 'login'
LOGIN_REDIRECT_URL = 'student_dashboard'

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
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

# Allow additional origins from environment (e.g. Vercel preview URLs)
_extra_origins = os.getenv('CORS_ALLOWED_ORIGINS_EXTRA', '')
if _extra_origins:
    CORS_ALLOWED_ORIGINS += [o.strip() for o in _extra_origins.split(',') if o.strip()]

# Allow all origins in DEBUG mode for convenience
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True

# LLM Configuration
LLM_PROVIDER = os.getenv('LLM_PROVIDER', 'openai')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
OPENAI_MODEL = os.getenv('OPENAI_MODEL', 'gpt-4o-mini')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-1.5-flash')
