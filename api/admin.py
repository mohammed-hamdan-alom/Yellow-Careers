from django.contrib import admin

from .models import User,JobSeeker,Employer,Job,Application,Resume, Address, Question, Answer, Company, EmployerJobRelation


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['first_name','last_name','email','phone_number','is_staff','is_active','is_superuser','date_joined']
    ordering = ['last_name', 'first_name']

@admin.register(JobSeeker)
class JobSeekerAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name','last_name','email','phone_number','dob','nationality']

@admin.register(Employer)
class EmployerAdmin(admin.ModelAdmin):
    list_display = ['first_name','last_name','email','phone_number','company','is_company_admin']

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['id','title','job_type','salary']
    ordering=['id']

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['job_seeker','job','date_applied']

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['about','experience']

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'website', 'about']

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ['id','city','post_code', 'country']
    ordering = ['id']

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['job','question']
    ordering = ['job']

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['application','question','answer']
    ordering = ['application']

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['id','company_name','website', 'about']
    ordering = ['id']

@admin.register(EmployerJobRelation)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['employer','job']
    ordering = ['employer']


