from django.contrib import admin
from .models import User

# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username','first_name','last_name','email','phone_number','is_staff','is_active','is_superuser','date_joined']
    list_filter = ('is_staff','is_active','is_superuser','date_joined')
    search_fields = ('username','first_name','last_name','email','phone_number')
    ordering = ['last_name', 'first_name']
