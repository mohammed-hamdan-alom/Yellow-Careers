from django.contrib import admin
from .models import User,JobSeeker,Employer,Job,Application,Resume


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['first_name','last_name','email','phone_number','is_staff','is_active','is_superuser','date_joined']
    ordering = ['last_name', 'first_name']

@admin.register(JobSeeker)
class JobSeekerAdmin(admin.ModelAdmin):
    list_display = ['first_name','last_name','email','phone_number','dob','nationality']

@admin.register(Employer)
class EmployerAdmin(admin.ModelAdmin):
    list_display = ['first_name','last_name','email','phone_number','company','is_company_admin']

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title','job_type','salary']

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['job_seeker','job','date_applied']

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['about','experience']

