from django.contrib import admin
from .models import *


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id','first_name','last_name','email','phone_number','is_staff','is_active','is_superuser','date_joined']
    ordering = ['last_name', 'first_name']

@admin.register(JobSeeker)
class JobSeekerAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name','last_name','email','phone_number','dob','nationality','resume']

@admin.register(Employer)
class EmployerAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name','last_name','email','phone_number','company','is_company_admin']

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['id','title','job_type','salary']
    ordering=['id']

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['id', 'job_seeker','job','date_applied']

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['id','about','experience']

@admin.register(SoftSkill)
class SoftSkillAdmin(admin.ModelAdmin):
    list_display = ['id', 'resume','skill']

@admin.register(TechnicalSkill)
class TechnicalSkillAdmin(admin.ModelAdmin):
    list_display = ['id', 'resume','skill']

@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ['id', 'resume','language','spoken_proficiency', 'written_proficiency']

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ['id', 'resume','start_date','end_date', 'address', 'level', 'institution', 'grade']

@admin.register(ProfessionalExperience)
class ProfessionalExperienceAdmin(admin.ModelAdmin):
    list_display = ['id', 'resume','start_date','end_date', 'address', 'company', 'position', 'description']

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['id','city','post_code', 'country']
    ordering = ['id']

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['id', 'job','question']
    ordering = ['job']

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['id', 'application','question','answer']
    ordering = ['application']

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['id','company_name','website', 'about']
    ordering = ['id']

@admin.register(EmployerJobRelation)
class EmployerJobRelationAdmin(admin.ModelAdmin):
    list_display = ['id', 'employer','job']
    ordering = ['employer']

@admin.register(SavedJobs)
class SavedJobsAdmin(admin.ModelAdmin):
    list_display = ['id', 'job_seeker','job']
    ordering = ['job_seeker']