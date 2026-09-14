"""Competition models."""
from django.db import models
from django.conf import settings
from django.utils import timezone


class Competition(models.Model):
    """A coding competition event."""

    class Status(models.TextChoices):
        UPCOMING = 'UPCOMING', 'Upcoming'
        LIVE = 'LIVE', 'Live'
        COMPLETED = 'COMPLETED', 'Completed'

    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    banner_color = models.CharField(max_length=20, default='#6C63FF')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    xp_reward_1st = models.IntegerField(default=500)
    xp_reward_2nd = models.IntegerField(default=300)
    xp_reward_3rd = models.IntegerField(default=200)
    xp_reward_participant = models.IntegerField(default=50)
    max_participants = models.IntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_competitions'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'competitions'
        ordering = ['-start_time']

    def __str__(self):
        return self.name

    @property
    def status(self):
        now = timezone.now()
        if now < self.start_time:
            return self.Status.UPCOMING
        elif now > self.end_time:
            return self.Status.COMPLETED
        return self.Status.LIVE

    @property
    def participant_count(self):
        return self.participants.count()

    @property
    def time_remaining(self):
        now = timezone.now()
        if self.status == self.Status.LIVE:
            delta = self.end_time - now
            return max(0, int(delta.total_seconds()))
        return 0


class CompetitionProblem(models.Model):
    """A challenge included in a competition."""
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='problems')
    challenge = models.ForeignKey('coding.CodingChallenge', on_delete=models.CASCADE)
    order = models.IntegerField(default=0)
    points = models.IntegerField(default=100)

    class Meta:
        db_table = 'competition_problems'
        ordering = ['competition', 'order']
        unique_together = [('competition', 'challenge')]


class CompetitionParticipant(models.Model):
    """A student participating in a competition."""
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name='participants')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='competition_participations')
    score = models.IntegerField(default=0)
    rank = models.IntegerField(null=True, blank=True)
    problems_solved = models.IntegerField(default=0)
    joined_at = models.DateTimeField(auto_now_add=True)
    xp_awarded = models.BooleanField(default=False)

    class Meta:
        db_table = 'competition_participants'
        unique_together = [('competition', 'student')]
        ordering = ['competition', 'rank', '-score']

    def __str__(self):
        return f"{self.student.username} in {self.competition.name}"
