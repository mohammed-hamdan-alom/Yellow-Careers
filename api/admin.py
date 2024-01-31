from django.contrib import admin
from .models import User, Job

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['first_name','last_name','email','phone_number','is_staff','is_active','is_superuser','date_joined']
    ordering = ['last_name', 'first_name']

