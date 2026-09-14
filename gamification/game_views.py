"""REST API Views for Code Logic Lab Games, Daily Challenges, Telemetry & Governance."""
import logging
from datetime import date
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated

from accounts.models import User, StudentProfile
from accounts.permissions import get_authorized_students_for_user
from .models import (
    GameDefinition, 
    GameLevel, 
    GameSession, 
    DailyCodeChallenge, 
    DailyChallengeCompletion, 
    StudentGameStats, 
    Achievement, 
    StudentAchievement
)
from .ai_game_analyzer import analyze_game_session
from gamification.engine import award_xp

logger = logging.getLogger(__name__)


def get_current_student(request):
    """Helper to resolve current student or fallback for local preview."""
    if request.user and request.user.is_authenticated:
        return request.user
    return User.objects.filter(role=User.Role.STUDENT).first() or User.objects.first()


class GameHubView(APIView):
    """Returns the complete Code Logic Lab hub: 12 games, user mastery, daily challenge."""
    permission_classes = [AllowAny]

    def get(self, request):
        student = get_current_student(request)
        games = GameDefinition.objects.filter(is_active=True).prefetch_related('levels')
        
        # Student stats map
        stats_map = {}
        if student:
            user_stats = StudentGameStats.objects.filter(student=student)
            for s in user_stats:
                stats_map[s.game_id] = {
                    'highest_level': s.highest_level_unlocked,
                    'levels_completed': s.levels_completed_count,
                    'average_accuracy': s.average_accuracy,
                    'total_xp': s.total_xp_earned,
                    'adaptive_difficulty': s.adaptive_difficulty,
                    'weak_concepts': s.weak_concepts,
                    'mastered_concepts': s.mastered_concepts
                }

        games_list = []
        total_levels_completed = 0
        total_game_xp = 0

        for g in games:
            levels = g.levels.filter(is_active=True).order_by('level_number')
            st = stats_map.get(g.id, {
                'highest_level': 1,
                'levels_completed': 0,
                'average_accuracy': 100.0,
                'total_xp': 0,
                'adaptive_difficulty': 'BEGINNER',
                'weak_concepts': [],
                'mastered_concepts': []
            })

            total_levels_completed += st['levels_completed']
            total_game_xp += st['total_xp']

            games_list.append({
                'id': g.id,
                'slug': g.slug,
                'title': g.title,
                'category': g.category,
                'category_label': g.get_category_display(),
                'concept': g.concept,
                'tagline': g.tagline,
                'description': g.description,
                'icon': g.icon,
                'badge_color': g.badge_color,
                'gradient': g.gradient,
                'languages_supported': g.languages_supported,
                'order': g.order,
                'total_levels': levels.count(),
                'user_progress': {
                    'highest_level_unlocked': st['highest_level'],
                    'levels_completed': st['levels_completed'],
                    'average_accuracy': st['average_accuracy'],
                    'total_xp': st['total_xp'],
                    'adaptive_difficulty': st['adaptive_difficulty'],
                    'weak_concepts': st['weak_concepts'],
                    'mastered_concepts': st['mastered_concepts'],
                    'is_mastered': st['levels_completed'] >= levels.count() and levels.count() > 0
                }
            })

        # Today's daily challenge
        today = date.today()
        daily = DailyCodeChallenge.objects.filter(date=today).select_related('game').first()
        daily_completed = False
        if daily and student:
            daily_completed = DailyChallengeCompletion.objects.filter(student=student, challenge=daily).exists()

        daily_data = None
        if daily:
            daily_data = {
                'id': daily.id,
                'title': daily.title,
                'description': daily.description,
                'game_title': daily.game.title,
                'game_slug': daily.game.slug,
                'game_icon': daily.game.icon,
                'target_concept': daily.target_concept,
                'difficulty': daily.difficulty,
                'xp_reward': daily.xp_reward,
                'is_completed': daily_completed,
                'level_config': daily.level_config
            }

        # Profile overview
        profile = getattr(student, 'student_profile', None) if student else None

        return Response({
            'hub_title': '🎮 CODE LOGIC LAB',
            'tagline': 'Interactive visual games connecting programming logic to real code.',
            'total_games_count': len(games_list),
            'total_levels_completed': total_levels_completed,
            'total_game_xp': total_game_xp,
            'student_total_xp': profile.total_xp if profile else total_game_xp,
            'student_streak': profile.current_streak if profile else 1,
            'daily_challenge': daily_data,
            'games': games_list
        })


class GameDetailView(APIView):
    """Returns details and all 5 levels for a specific logic game."""
    permission_classes = [AllowAny]

    def get(self, request, slug):
        student = get_current_student(request)
        game = get_object_or_404(GameDefinition, slug=slug, is_active=True)
        levels = game.levels.filter(is_active=True).order_by('level_number')
        
        stats = None
        if student:
            stats = StudentGameStats.objects.filter(student=student, game=game).first()

        highest_unlocked = stats.highest_level_unlocked if stats else 1

        levels_data = []
        for lvl in levels:
            is_unlocked = (lvl.level_number <= highest_unlocked)
            # Find recent session for this level
            recent_session = None
            if student:
                recent_session = GameSession.objects.filter(
                    student=student, 
                    game=game, 
                    level=lvl
                ).order_by('-started_at').first()

            levels_data.append({
                'id': lvl.id,
                'level_number': lvl.level_number,
                'difficulty': lvl.difficulty,
                'difficulty_label': lvl.get_difficulty_display(),
                'title': lvl.title,
                'objective': lvl.objective,
                'instructions': lvl.instructions,
                'initial_state': lvl.initial_state,
                'solution_criteria': lvl.solution_criteria,
                'hints': lvl.hints,
                'code_snippets': lvl.code_snippets,
                'xp_reward': lvl.xp_reward,
                'perfect_bonus_xp': lvl.perfect_bonus_xp,
                'no_hint_bonus_xp': lvl.no_hint_bonus_xp,
                'is_unlocked': is_unlocked,
                'best_accuracy': recent_session.accuracy_percentage if recent_session else None,
                'is_completed': recent_session.status == GameSession.Status.COMPLETED if recent_session else False
            })

        return Response({
            'id': game.id,
            'slug': game.slug,
            'title': game.title,
            'concept': game.concept,
            'tagline': game.tagline,
            'description': game.description,
            'icon': game.icon,
            'badge_color': game.badge_color,
            'gradient': game.gradient,
            'languages_supported': game.languages_supported,
            'highest_level_unlocked': highest_unlocked,
            'stats': {
                'total_xp': stats.total_xp_earned if stats else 0,
                'average_accuracy': stats.average_accuracy if stats else 100.0,
                'adaptive_difficulty': stats.adaptive_difficulty if stats else 'BEGINNER',
                'weak_concepts': stats.weak_concepts if stats else [],
                'mastered_concepts': stats.mastered_concepts if stats else []
            },
            'levels': levels_data
        })


class GameSessionCompleteView(APIView):
    """Processes game telemetry, executes AI analysis, awards XP, and updates difficulty."""
    permission_classes = [AllowAny]

    def post(self, request):
        student = get_current_student(request)
        game_slug = request.data.get('game_slug') or request.data.get('slug')
        game_id = request.data.get('game_id')
        level_number = int(request.data.get('level_number', request.data.get('level_id', 1)))
        
        if game_slug:
            game = get_object_or_404(GameDefinition, slug=game_slug)
        elif game_id:
            game = get_object_or_404(GameDefinition, id=game_id)
        else:
            return Response({'error': 'game_slug or game_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        level = GameLevel.objects.filter(game=game, level_number=level_number).first()
        if not level and request.data.get('level_id'):
            level = GameLevel.objects.filter(id=request.data.get('level_id')).first()

        telemetry_data = {
            'attempts': request.data.get('attempts', 1),
            'mistakes': request.data.get('mistakes', 0),
            'hints_used': request.data.get('hints_used', 0),
            'time_taken_seconds': request.data.get('time_taken_seconds', 30),
            'steps_executed': request.data.get('steps_executed', 5),
            'optimal_steps': request.data.get('optimal_steps', 5),
            'is_completed': request.data.get('is_completed', True),
            'concepts_tested': request.data.get('concepts_tested', [game.concept]),
            'mistake_log': request.data.get('mistake_log', []),
            'language_mode': request.data.get('language_mode', 'python')
        }

        analysis_result = analyze_game_session(student, game, level, telemetry_data)
        return Response(analysis_result, status=status.HTTP_200_OK)


class DailyChallengeView(APIView):
    """Returns today's daily code challenge and allows completion submission."""
    permission_classes = [AllowAny]

    def get(self, request):
        today = date.today()
        daily = DailyCodeChallenge.objects.filter(date=today).select_related('game').first()
        if not daily:
            # Fallback to most recent daily challenge
            daily = DailyCodeChallenge.objects.select_related('game').first()

        if not daily:
            return Response({'has_challenge': False, 'message': 'No daily challenge active.'})

        student = get_current_student(request)
        is_completed = False
        if student:
            is_completed = DailyChallengeCompletion.objects.filter(student=student, challenge=daily).exists()

        return Response({
            'has_challenge': True,
            'id': daily.id,
            'date': daily.date.strftime('%Y-%m-%d'),
            'title': daily.title,
            'description': daily.description,
            'game_slug': daily.game.slug,
            'game_title': daily.game.title,
            'game_icon': daily.game.icon,
            'target_concept': daily.target_concept,
            'difficulty': daily.difficulty,
            'xp_reward': daily.xp_reward,
            'is_completed': is_completed,
            'level_config': daily.level_config
        })

    def post(self, request):
        """Submit daily challenge completion and award +100 XP."""
        student = get_current_student(request)
        if not student:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        challenge_id = request.data.get('challenge_id')
        challenge = get_object_or_404(DailyCodeChallenge, id=challenge_id)
        time_taken = int(request.data.get('time_taken_seconds', 45))

        already_done = DailyChallengeCompletion.objects.filter(student=student, challenge=challenge).first()
        if already_done:
            return Response({
                'already_completed': True,
                'message': 'Daily challenge already completed today!',
                'xp_awarded': 0
            })

        DailyChallengeCompletion.objects.create(
            student=student,
            challenge=challenge,
            xp_awarded=challenge.xp_reward,
            time_taken_seconds=time_taken
        )

        new_total_xp, leveled_up, new_level = award_xp(
            student=student,
            amount=challenge.xp_reward,
            source='GAME',
            description=f"Completed Daily Challenge: {challenge.title}",
            reference_id=challenge.id
        )

        return Response({
            'success': True,
            'message': f"🎉 Daily Challenge Complete! +{challenge.xp_reward} XP Earned!",
            'xp_awarded': challenge.xp_reward,
            'new_total_xp': new_total_xp,
            'leveled_up': leveled_up,
            'new_level': new_level
        })


class GameLeaderboardView(APIView):
    """Returns top student ranking in Code Logic Games with privacy support."""
    permission_classes = [AllowAny]

    def get(self, request):
        students_qs = User.objects.filter(role=User.Role.STUDENT, is_active=True).select_related('student_profile')
        leaderboard = []

        for stu in students_qs:
            profile = getattr(stu, 'student_profile', None)
            game_stats = StudentGameStats.objects.filter(student=stu)
            
            total_game_xp = sum(s.total_xp_earned for s in game_stats)
            total_completed = sum(s.levels_completed_count for s in game_stats)
            avg_acc = 100.0
            if game_stats.exists():
                avg_acc = round(sum(s.average_accuracy for s in game_stats) / game_stats.count(), 1)

            leaderboard.append({
                'id': stu.id,
                'username': stu.username,
                'name': stu.get_full_name() or stu.username,
                'total_xp': profile.total_xp if profile else total_game_xp,
                'game_xp': total_game_xp,
                'levels_completed': total_completed,
                'average_accuracy': avg_acc,
                'streak': profile.current_streak if profile else 1,
                'level': profile.current_level if profile else 1
            })

        leaderboard.sort(key=lambda x: (x['game_xp'], x['total_xp'], x['average_accuracy']), reverse=True)
        for idx, item in enumerate(leaderboard, 1):
            item['rank'] = idx

        return Response({
            'count': len(leaderboard),
            'rankings': leaderboard[:50]
        })


class TeacherGameAnalyticsView(APIView):
    """Teacher view: student game metrics, attempts, accuracy, and weak concepts."""
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated and request.user.role == User.Role.STUDENT:
            return Response({'error': '403 Forbidden: Teacher access required.'}, status=403)

        students_qs = get_authorized_students_for_user(request.user) if request.user.is_authenticated else User.objects.filter(role=User.Role.STUDENT)
        students_qs = students_qs.select_related('student_profile')

        analytics_data = []
        for stu in students_qs:
            profile = getattr(stu, 'student_profile', None)
            sessions = GameSession.objects.filter(student=stu)
            stats = StudentGameStats.objects.filter(student=stu)

            total_sessions = sessions.count()
            avg_acc = 85.0
            if sessions.exists():
                avg_acc = round(sum(s.accuracy_percentage for s in sessions) / sessions.count(), 1)

            all_weak_concepts = []
            for s in stats:
                all_weak_concepts.extend(s.weak_concepts)
            all_weak_concepts = list(set(all_weak_concepts)) or ['Iteration bounds (Loops)']

            status_label = 'Excellent' if avg_acc >= 85 else 'Good' if avg_acc >= 70 else 'Needs Support'

            # Recent games summary
            recent_games = []
            for sess in sessions[:3]:
                recent_games.append({
                    'game': sess.game.title,
                    'level': sess.level.level_number if sess.level else 1,
                    'accuracy': sess.accuracy_percentage,
                    'attempts': sess.attempts,
                    'status': sess.status,
                    'ai_feedback': sess.ai_feedback[:80] + '...' if len(sess.ai_feedback) > 80 else sess.ai_feedback
                })

            analytics_data.append({
                'student_id': stu.id,
                'name': stu.get_full_name() or stu.username,
                'email': stu.email or f"{stu.username}@academy.org",
                'year': profile.educational_year if profile else 'Year 1',
                'total_game_sessions': total_sessions,
                'average_game_accuracy': avg_acc,
                'status': status_label,
                'weak_concepts': all_weak_concepts,
                'recent_games': recent_games,
                'total_xp': profile.total_xp if profile else 150
            })

        return Response({
            'cohort_count': len(analytics_data),
            'students': analytics_data
        })


class AdminGameManageView(APIView):
    """Admin view to manage games, toggle availability, edit XP rewards and difficulty settings."""
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated and request.user.role not in [User.Role.ADMIN, 'ADMIN'] and not request.user.is_superuser:
            return Response({'error': '403 Forbidden: Administrator access required.'}, status=403)

        games = GameDefinition.objects.all().prefetch_related('levels').order_by('order')
        total_sessions = GameSession.objects.count()
        total_completions = GameSession.objects.filter(status=GameSession.Status.COMPLETED).count()

        games_data = []
        for g in games:
            play_count = g.sessions.count()
            levels_count = g.levels.count()
            games_data.append({
                'id': g.id,
                'slug': g.slug,
                'title': g.title,
                'category': g.category,
                'concept': g.concept,
                'icon': g.icon,
                'badge_color': g.badge_color,
                'is_active': g.is_active,
                'levels_count': levels_count,
                'total_play_count': play_count,
                'order': g.order
            })

        return Response({
            'total_games': len(games_data),
            'total_sessions_logged': total_sessions,
            'total_completions': total_completions,
            'games': games_data
        })

    def patch(self, request):
        """Toggle active status or update game parameters."""
        if request.user.is_authenticated and request.user.role not in [User.Role.ADMIN, 'ADMIN'] and not request.user.is_superuser:
            return Response({'error': '403 Forbidden: Administrator access required.'}, status=403)

        game_id = request.data.get('game_id') or request.data.get('id')
        game = get_object_or_404(GameDefinition, id=game_id)

        if 'is_active' in request.data:
            game.is_active = bool(request.data['is_active'])
        if 'concept' in request.data:
            game.concept = request.data['concept']
        if 'tagline' in request.data:
            game.tagline = request.data['tagline']
        game.save()

        return Response({
            'success': True,
            'message': f"Game '{game.title}' updated successfully.",
            'is_active': game.is_active
        })
