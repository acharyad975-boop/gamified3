# Gamified Code Academy

## Setup Instructions

1. Install dependencies:
```
pip install -r requirements.txt
```

2. Copy environment file:
```
copy .env.example .env
```

3. Run migrations:
```
python manage.py migrate
```

4. Seed initial data:
```
python manage.py seed_data
```

5. Create superuser:
```
python manage.py createsuperuser
```

6. Run development server:
```
python manage.py runserver
```

Visit `http://127.0.0.1:8000/`
