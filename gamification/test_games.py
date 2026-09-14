from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from accounts.models import StudentProfile
from gamification.models import GameDefinition, GameLevel, GameSession, DailyCodeChallenge
from gamification.ai_game_analyzer import analyze_game_session

User = get_user_model()

class CodeLogicLabTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.student = User.objects.create_user(
            username='gamestudent',
            email='student@test.com',
            password='password123',
            role='STUDENT'
        )
        StudentProfile.objects.get_or_create(user=self.student, defaults={'total_xp': 0, 'current_streak': 1})
        self.teacher = User.objects.create_user(
            username='gameteacher',
            email='teacher@test.com',
            password='password123',
            role='TEACHER'
        )
        self.admin = User.objects.create_user(
            username='gameadmin',
            email='admin@test.com',
            password='password123',
            role='ADMIN',
            is_staff=True,
            is_superuser=True
        )

        # Create test game & level
        self.game = GameDefinition.objects.create(
            title='Test Robot Programmer',
            slug='robot-programmer-test',
            category='LOGIC',
            concept='Sequential execution',
            tagline='Master basic movement commands',
            description='Control a rover using commands',
            icon='🤖',
            languages_supported=['python', 'javascript', 'cpp']
        )
        self.level = GameLevel.objects.create(
            game=self.game,
            level_number=1,
            difficulty='BEGINNER',
            title='First Steps',
            objective='Walk forward 2 tiles',
            instructions='Press step twice',
            initial_state={'player_pos': [0, 0], 'target_pos': [0, 2]},
            solution_criteria={'target_pos': [0, 2]},
            hints=['Move forward twice.'],
            code_snippets={
                'python': 'move_forward()\nmove_forward()',
                'javascript': 'moveForward();\nmoveForward();',
                'cpp': 'moveForward();\nmoveForward();'
            },
            xp_reward=30,
            perfect_bonus_xp=10,
            no_hint_bonus_xp=5
        )

    def test_game_hub_endpoint(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get('/api/games/hub/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('games', response.data)
        self.assertTrue(any(g['slug'] == 'robot-programmer-test' for g in response.data['games']))

    def test_game_detail_endpoint(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(f'/api/games/{self.game.slug}/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('levels', response.data)
        self.assertEqual(len(response.data['levels']), 1)
        self.assertEqual(response.data['slug'], self.game.slug)

    def test_game_completion_and_ai_analysis(self):
        self.client.force_authenticate(user=self.student)
        telemetry_payload = {
            'game_id': self.game.id,
            'level_id': self.level.id,
            'is_completed': True,
            'attempts': 1,
            'mistakes': 0,
            'hints_used': 0,
            'time_taken_seconds': 25,
            'steps_executed': 2,
            'optimal_steps': 2,
            'language_mode': 'python',
            'mistake_log': []
        }
        response = self.client.post('/api/games/session/complete/', telemetry_payload, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['accuracy'], 100)
        self.assertGreaterEqual(response.data['xp_earned'], 30)

        # Check DB session
        session = GameSession.objects.filter(student=self.student, game=self.game).first()
        self.assertIsNotNone(session)
        self.assertEqual(session.status, GameSession.Status.COMPLETED)

    def test_leaderboard_endpoint(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get('/api/games/leaderboard/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('rankings', response.data)

    def test_admin_governance_toggle(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.patch('/api/games/admin/manage/', {'id': self.game.id, 'is_active': False}, format='json')
        self.assertEqual(response.status_code, 200)
        self.game.refresh_from_db()
        self.assertFalse(self.game.is_active)
