from django.contrib import admin
from .models import Classroom

@admin.register(Classroom)
class ClassroomAdmin(admin.ModelAdmin):
    list_display = ['name', 'teacher', 'section', 'academic_year', 'created_at']
    search_fields = ['name', 'teacher__username', 'section']
