"""Subject and programming language models."""
from django.db import models


class Subject(models.Model):
    """A learning subject (e.g., Python, Java, SQL)."""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='code')  # icon name
    color = models.CharField(max_length=20, default='#6C63FF')
    bg_gradient = models.CharField(max_length=100, default='linear-gradient(135deg, #6C63FF, #3D3A8E)')
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'subjects'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

    def get_total_lessons(self):
        from curriculum.models import Lesson
        return Lesson.objects.filter(level__subject=self).count()

    def get_total_challenges(self):
        from coding.models import CodingChallenge
        return CodingChallenge.objects.filter(subject=self).count()


class ProgrammingLanguage(models.Model):
    """A programming language supported for code execution."""
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)
    extension = models.CharField(max_length=10)  # .py, .java, etc.
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=20, default='#6C63FF')
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'programming_languages'
        ordering = ['name']

    def __str__(self):
        return self.name
