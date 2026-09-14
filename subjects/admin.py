from django.contrib import admin
from .models import Subject, ProgrammingLanguage

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order', 'is_active']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(ProgrammingLanguage)
class ProgrammingLanguageAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'extension', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
