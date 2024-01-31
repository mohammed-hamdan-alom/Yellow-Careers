from django.contrib import admin
from api.models import user_models  

@admin.register(user_models.User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username','first_name','last_name','email','phone_number','is_staff','is_active','is_superuser','date_joined']
