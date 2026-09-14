"""AI Game Telemetry Analysis, Adaptive Difficulty & Learning DNA Integration Engine."""
import logging
from django.utils import timezone
from .models import GameDefinition, GameLevel, GameSession, StudentGameStats, Achievement, StudentAchievement
from gamification.engine import award_xp, check_achievements
from ai_engine.models import AIStudentProfile

logger = logging.getLogger(__name__)

DIFFICULTY_TIERS = ['BEGINNER', 'EASY', 'MEDIUM', 'HARD', 'EXPERT']


def analyze_game_session(student, game, level, telemetry_data: dict) -> dict:
    """
    Ingests granular game session telemetry, computes AI diagnostic synthesis,
    adjusts adaptive difficulty, awards XP, and updates Learning DNA.
    """
    attempts = int(telemetry_data.get('attempts', 1))
    mistakes = int(telemetry_data.get('mistakes', 0))
    hints_used = int(telemetry_data.get('hints_used', 0))
    time_taken = int(telemetry_data.get('time_taken_seconds', 30))
    steps_executed = int(telemetry_data.get('steps_executed', 5))
    optimal_steps = int(telemetry_data.get('optimal_steps', max(1, steps_executed)))
    is_completed = bool(telemetry_data.get('is_completed', True))
    concepts_tested = telemetry_data.get('concepts_tested', [game.concept])
    mistake_log = telemetry_data.get('mistake_log', [])
    language_mode = telemetry_data.get('language_mode', 'python')

    # Calculate Accuracy & Efficiency
    base_accuracy = max(0.0, min(100.0, 100.0 - (mistakes * 15.0) - (hints_used * 10.0)))
    if not is_completed:
        base_accuracy = min(base_accuracy, 40.0)
    
    efficiency_score = 100.0
    if optimal_steps > 0 and steps_executed > 0:
        efficiency_score = min(100.0, round((optimal_steps / max(optimal_steps, steps_executed)) * 100.0, 1))

    is_perfect = (is_completed and mistakes == 0 and hints_used == 0)

    # Calculate XP Reward
    xp_base = level.xp_reward if level else 50
    xp_earned = 0
    if is_completed:
        xp_earned = xp_base
        if is_perfect:
            xp_earned += level.perfect_bonus_xp if level else 25
        if hints_used == 0:
            xp_earned += level.no_hint_bonus_xp if level else 20

    # AI Adaptive Difficulty Engine
    current_diff = level.difficulty if level else 'BEGINNER'
    curr_idx = DIFFICULTY_TIERS.index(current_diff) if current_diff in DIFFICULTY_TIERS else 0
    
    if is_completed and base_accuracy >= 85.0 and mistakes <= 1:
        next_diff_idx = min(len(DIFFICULTY_TIERS) - 1, curr_idx + 1)
        adaptive_difficulty = DIFFICULTY_TIERS[next_diff_idx]
        diff_status = "ADVANCE_DIFFICULTY"
    elif not is_completed or base_accuracy < 60.0 or attempts >= 3:
        prev_diff_idx = max(0, curr_idx - 1)
        adaptive_difficulty = DIFFICULTY_TIERS[prev_diff_idx]
        diff_status = "REMEDIATION_SUPPORT"
    else:
        adaptive_difficulty = current_diff
        diff_status = "CONSOLIDATE_TIER"

    # AI Pedagogical Diagnostic Feedback Generation
    ai_feedback = generate_pedagogical_feedback(game, level, base_accuracy, mistakes, hints_used, mistake_log)
    recommended_actions = generate_recommended_actions(game, level, base_accuracy, adaptive_difficulty)

    # Record or update GameSession in DB
    session = GameSession.objects.create(
        student=student,
        game=game,
        level=level,
        difficulty=current_diff,
        language_mode=language_mode,
        status=GameSession.Status.COMPLETED if is_completed else GameSession.Status.FAILED,
        attempts=attempts,
        mistakes_count=mistakes,
        hints_used=hints_used,
        time_taken_seconds=time_taken,
        accuracy_percentage=base_accuracy,
        steps_executed=steps_executed,
        optimal_steps=optimal_steps,
        efficiency_score=efficiency_score,
        score=int(base_accuracy * 10),
        xp_earned=xp_earned,
        is_perfect=is_perfect,
        concepts_tested=concepts_tested,
        mistake_log=mistake_log,
        ai_feedback=ai_feedback,
        ai_recommended_difficulty=adaptive_difficulty,
        ai_recommended_actions=recommended_actions,
        completed_at=timezone.now()
    )

    # Update Student Game Aggregate Stats
    stats, _ = StudentGameStats.objects.get_or_create(student=student, game=game)
    stats.total_attempts += attempts
    stats.total_mistakes += mistakes
    stats.total_play_time_seconds += time_taken
    stats.total_xp_earned += xp_earned
    
    if is_completed:
        lvl_num = level.level_number if level else 1
        stats.highest_level_unlocked = max(stats.highest_level_unlocked, lvl_num + 1)
        stats.levels_completed_count += 1
    
    # Rolling accuracy average
    stats.average_accuracy = round(((stats.average_accuracy * 0.7) + (base_accuracy * 0.3)), 1)
    stats.adaptive_difficulty = adaptive_difficulty
    
    if base_accuracy >= 80.0 and game.concept not in stats.mastered_concepts:
        stats.mastered_concepts.append(game.concept)
        if game.concept in stats.weak_concepts:
            stats.weak_concepts.remove(game.concept)
    elif base_accuracy < 65.0 and game.concept not in stats.weak_concepts:
        stats.weak_concepts.append(game.concept)

    stats.save()

    # Award real platform XP via Gamification Engine
    new_total_xp = 0
    leveled_up = False
    new_level = 1
    if xp_earned > 0:
        new_total_xp, leveled_up, new_level = award_xp(
            student=student,
            amount=xp_earned,
            source='GAME',
            description=f"Completed {game.title} Level {level.level_number if level else 1} ({current_diff})",
            reference_id=session.id
        )

    # Update Student Learning DNA (Visual & Practical effectiveness)
    update_student_learning_dna(student, base_accuracy, is_completed)

    # Check Game Achievements
    check_game_achievements(student)

    return {
        'session_id': session.id,
        'game_title': game.title,
        'level_number': level.level_number if level else 1,
        'is_completed': is_completed,
        'accuracy': base_accuracy,
        'efficiency_score': efficiency_score,
        'xp_earned': xp_earned,
        'is_perfect': is_perfect,
        'hints_used': hints_used,
        'mistakes': mistakes,
        'ai_feedback': ai_feedback,
        'adaptive_difficulty': adaptive_difficulty,
        'diff_status': diff_status,
        'recommended_actions': recommended_actions,
        'new_total_xp': new_total_xp,
        'leveled_up': leveled_up,
        'new_level': new_level,
        'highest_level_unlocked': stats.highest_level_unlocked
    }


def generate_pedagogical_feedback(game, level, accuracy, mistakes, hints_used, mistake_log) -> str:
    """Generates natural language pedagogical feedback based on error types and latency."""
    slug = game.slug
    lvl_name = level.title if level else "Level"

    if accuracy >= 90.0:
        if hints_used == 0:
            return f"Outstanding mastery! You solved '{lvl_name}' with flawless logic and zero hints. You demonstrated fluent understanding of {game.concept}."
        return f"Great job! You completed '{lvl_name}' with high precision ({accuracy}% accuracy). Ready to advance to the next difficulty tier."

    if accuracy >= 70.0:
        if mistakes > 0:
            return f"Solid effort! You completed '{lvl_name}', but encountered minor logic adjustments. Review step sequences to optimize execution efficiency."
        return f"Good comprehension of {game.concept}. Try replaying without hints to earn the Perfect Solution badge."

    # Remedial feedback per game category
    if "loop" in slug:
        return f"You understand basic repetition, but struggled with iteration bounds or loop count parameters. Notice how range(N) iterates exactly N times starting from 0."
    elif "robot" in slug or "logic" in slug:
        return f"Watch the sequential order of execution. In coding, statements execute top-to-bottom; verify your command queue before pressing RUN."
    elif "conditional" in slug:
        return f"Review boolean branch evaluation. Remember that an ELIF branch only evaluates when the preceding IF condition is False."
    elif "variable" in slug:
        return f"Notice that `x = x + 5` evaluates the right side first using current state, then overwrites x with the newly computed value."
    elif "array" in slug:
        return f"Remember that array indexing is 0-based: index 0 is the first item, and index len-1 is the final item. Avoid off-by-one errors."
    elif "recursion" in slug:
        return f"Check your base case condition! Without a valid base case return guard, recursive calls accumulate on the call stack indefinitely."
    elif "sort" in slug:
        return f"Carefully inspect each adjacent element comparison. In Bubble Sort, elements swap only when the left element is strictly greater than the right."
    elif "debug" in slug:
        return f"Sharp detective eye needed: check for missing colons at loop/if headers, infinite loops, and variable scope inconsistencies."
    
    return f"Keep practicing {game.concept}. We recommend watching the step-by-step interactive visual animation before reattempting."


def generate_recommended_actions(game, level, accuracy, adaptive_difficulty) -> list:
    """Suggests personalized multimodal next actions."""
    if accuracy >= 85.0:
        return [
            {"label": f"🚀 Advance to {adaptive_difficulty} Level", "type": "NEXT_LEVEL", "icon": "ArrowRight"},
            {"label": "💻 Try Real Code Challenge", "type": "CODING_CHALLENGE", "icon": "Code2"},
            {"label": "🏆 View Game Leaderboard", "type": "LEADERBOARD", "icon": "Trophy"}
        ]
    elif accuracy >= 60.0:
        return [
            {"label": "🔄 Replay for Perfect Score (+25 XP)", "type": "RETRY_PERFECT", "icon": "Repeat"},
            {"label": "🎬 Watch Code Step Animation", "type": "ANIMATION", "icon": "Play"},
            {"label": "🚀 Next Challenge", "type": "NEXT_LEVEL", "icon": "ArrowRight"}
        ]
    else:
        return [
            {"label": "🎬 Watch Interactive Concept Animation", "type": "ANIMATION", "icon": "Play"},
            {"label": "🎯 Remedial Support Drill", "type": "REMEDIAL", "icon": "Target"},
            {"label": "🔄 Replay Level with Hint Guide", "type": "RETRY", "icon": "Repeat"}
        ]


def update_student_learning_dna(student, accuracy, is_completed):
    """Dynamically updates student's Learning DNA based on gameplay engagement."""
    try:
        profile = AIStudentProfile.objects.filter(student=student).first()
        if profile and profile.effective_learning_formats:
            formats = profile.effective_learning_formats
            for fmt in formats:
                if fmt.get('format') in ['interactive', 'practical_coding', 'visual_diagrams']:
                    current_score = fmt.get('effectiveness_score', 85)
                    delta = 2 if is_completed and accuracy >= 80 else 1
                    fmt['effectiveness_score'] = min(99, current_score + delta)
            profile.effective_learning_formats = formats
            profile.save(update_fields=['effective_learning_formats', 'updated_at'])
    except Exception as e:
        logger.warning(f"Failed to update Learning DNA: {e}")


def check_game_achievements(student):
    """Checks and unlocks game-related achievements."""
    try:
        completed_sessions = GameSession.objects.filter(
            student=student, 
            status=GameSession.Status.COMPLETED
        )
        total_games_completed = completed_sessions.count()
        perfect_games = completed_sessions.filter(is_perfect=True).count()
        no_hint_games = completed_sessions.filter(hints_used=0).count()

        already_unlocked = set(
            StudentAchievement.objects.filter(student=student).values_list('achievement_id', flat=True)
        )

        for ach in Achievement.objects.filter(is_active=True).exclude(id__in=already_unlocked):
            unlocked = False
            ct = ach.condition_type
            cv = ach.condition_value

            if ct == 'GAMES_COMPLETED' and total_games_completed >= cv:
                unlocked = True
            elif ct == 'GAME_PERFECT' and perfect_games >= cv:
                unlocked = True
            elif ct == 'NO_HINT_GAMES' and no_hint_games >= cv:
                unlocked = True

            if unlocked:
                StudentAchievement.objects.create(student=student, achievement=ach)
                award_xp(
                    student=student,
                    amount=ach.xp_reward,
                    source='ACHIEVEMENT',
                    description=f"Achievement Unlocked: {ach.name}",
                    reference_id=ach.id
                )
    except Exception as e:
        logger.warning(f"Achievement check failed: {e}")
