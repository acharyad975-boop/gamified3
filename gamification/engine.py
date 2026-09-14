"""
Gamification engine - core utilities for XP, levels, achievements, and streaks.
"""
from django.conf import settings
from django.utils import timezone
from datetime import date


def get_level_for_xp(total_xp):
    """Return the level number for a given XP total."""
    level = 1
    for lvl, threshold in settings.XP_LEVELS:
        if total_xp >= threshold:
            level = lvl
        else:
            break
    return level


def award_xp(student, amount, source, description, reference_id=None):
    """
    Award (or deduct) XP to a student.
    Records the transaction, updates profile, checks for level-up, triggers achievements.
    Returns (new_total_xp, leveled_up, new_level).
    """
    from gamification.models import XPTransaction
    from accounts.models import StudentProfile

    profile = StudentProfile.objects.get(user=student)
    old_level = profile.current_level

    # Create XP transaction
    XPTransaction.objects.create(
        student=student,
        amount=amount,
        source=source,
        description=description,
        reference_id=reference_id,
    )

    # Update profile XP
    profile.total_xp = max(0, profile.total_xp + amount)
    new_level = get_level_for_xp(profile.total_xp)
    profile.current_level = new_level
    profile.save(update_fields=['total_xp', 'current_level', 'updated_at'])

    leveled_up = new_level > old_level

    # Send level-up notification
    if leveled_up:
        create_notification(
            user=student,
            title=f"🎉 Level Up! You're now Level {new_level}!",
            message=f"Amazing! You've reached Level {new_level}. Keep it up!",
            notification_type='LEVEL_UP',
            icon='⬆️',
        )

    # Send XP notification (only for positive amounts)
    if amount > 0:
        create_notification(
            user=student,
            title=f"+{amount} XP Earned!",
            message=description,
            notification_type='XP_EARNED',
            icon='⚡',
        )

    # Check achievements
    check_achievements(student, profile)

    # Update streak
    update_streak(student, profile)

    return profile.total_xp, leveled_up, new_level


def check_achievements(student, profile=None):
    """Check and unlock any newly-earned achievements for a student."""
    from gamification.models import Achievement, StudentAchievement, XPTransaction
    from accounts.models import StudentProfile

    if profile is None:
        profile = StudentProfile.objects.get(user=student)

    already_unlocked = set(
        StudentAchievement.objects.filter(student=student).values_list('achievement_id', flat=True)
    )

    for achievement in Achievement.objects.filter(is_active=True).exclude(id__in=already_unlocked):
        unlocked = False
        ct = achievement.condition_type
        cv = achievement.condition_value

        if ct == 'TOTAL_XP' and profile.total_xp >= cv:
            unlocked = True
        elif ct == 'CHALLENGES_COMPLETED' and profile.challenges_completed >= cv:
            unlocked = True
        elif ct == 'QUIZZES_COMPLETED' and profile.quizzes_completed >= cv:
            unlocked = True
        elif ct == 'LESSONS_COMPLETED' and profile.lessons_completed >= cv:
            unlocked = True
        elif ct == 'STREAK_DAYS' and profile.current_streak >= cv:
            unlocked = True
        elif ct == 'FIRST_SUBMISSION' and profile.challenges_completed >= 1:
            unlocked = True
        elif ct == 'FIRST_QUIZ' and profile.quizzes_completed >= 1:
            unlocked = True

        if unlocked:
            StudentAchievement.objects.create(student=student, achievement=achievement)
            # Award achievement XP (without re-triggering achievements)
            XPTransaction.objects.create(
                student=student,
                amount=achievement.xp_reward,
                source='ACHIEVEMENT',
                description=f"Achievement unlocked: {achievement.name}",
            )
            from accounts.models import StudentProfile as SP
            SP.objects.filter(user=student).update(
                total_xp=profile.total_xp + achievement.xp_reward
            )
            create_notification(
                user=student,
                title=f"{achievement.icon} Achievement Unlocked: {achievement.name}",
                message=achievement.description,
                notification_type='ACHIEVEMENT',
                icon=achievement.icon,
            )


def update_streak(student, profile=None):
    """Update the student's daily streak."""
    from accounts.models import StudentProfile

    if profile is None:
        profile = StudentProfile.objects.get(user=student)

    today = date.today()

    if profile.last_activity_date is None:
        profile.current_streak = 1
        profile.longest_streak = max(1, profile.longest_streak)
        profile.last_activity_date = today
        profile.save(update_fields=['current_streak', 'longest_streak', 'last_activity_date'])
        return

    delta = (today - profile.last_activity_date).days
    if delta == 0:
        return  # already updated today
    elif delta == 1:
        # Consecutive day
        profile.current_streak += 1
        profile.longest_streak = max(profile.current_streak, profile.longest_streak)
    else:
        # Streak broken
        profile.current_streak = 1

    profile.last_activity_date = today
    profile.save(update_fields=['current_streak', 'longest_streak', 'last_activity_date'])

    # Streak bonuses
    if profile.current_streak in [7, 14, 30, 60, 100]:
        bonus = profile.current_streak * 5
        from gamification.models import XPTransaction
        XPTransaction.objects.create(
            student=student,
            amount=bonus,
            source='STREAK',
            description=f"{profile.current_streak}-day streak bonus!",
        )
        from accounts.models import StudentProfile as SP
        SP.objects.filter(user=student).update(total_xp=profile.total_xp + bonus)


def create_notification(user, title, message, notification_type='SYSTEM', icon='🔔', url=''):
    """Create an in-app notification for a user."""
    try:
        from notifications.models import Notification
        Notification.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type=notification_type,
            icon=icon,
            url=url,
        )
    except Exception:
        pass  # Never let notification failure break the main flow


def get_leaderboard_data(scope='global', subject_id=None, limit=50):
    """Return leaderboard data as a list of dicts."""
    from accounts.models import StudentProfile, User
    from django.db.models import F

    qs = StudentProfile.objects.filter(
        user__role='STUDENT',
        user__is_active=True
    ).select_related('user').order_by('-total_xp', '-coding_score')[:limit]

    result = []
    for rank, profile in enumerate(qs, 1):
        full_name = profile.user.get_full_name()
        result.append({
            'rank': rank,
            'username': profile.user.username,
            'display_name': full_name or profile.user.username,
            'full_name': full_name,
            'avatar_url': profile.get_avatar_url(),
            'level': profile.current_level,
            'total_xp': profile.total_xp,
            'coding_score': profile.coding_score,
            'quiz_score': profile.quiz_score,
            'code_quality': profile.code_quality_avg,
            'challenges_completed': profile.challenges_completed,
            'quizzes_completed': profile.quizzes_completed,
            'streak': profile.current_streak,
        })
    return result
