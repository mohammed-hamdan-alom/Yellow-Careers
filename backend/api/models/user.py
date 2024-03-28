from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext as _
from .employer_job_relation import EmployerJobRelation
from .managers import CustomUserManager
from django.core.validators import RegexValidator

class User(AbstractUser):
    """Custom user model with email as primary key"""
    username = None
    email = models.EmailField(unique=True, blank=False)
    first_name = models.CharField(max_length=50, blank=False)
    last_name = models.CharField(max_length=50, blank=False)
    other_names = models.CharField(max_length=50, blank=True)
    phone_number = models.CharField(blank=False, max_length=15, validators=[RegexValidator(r'^\+?1?\d{9,15}$')])
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    class Meta:
        ordering = ['last_name', 'first_name']
        
    def __str__(self):
        return f"{self.email} - {self.first_name} {self.last_name}"


class JobSeeker(User):
    """Model that represents a job seeker and inherits from User"""
    class Sex(models.TextChoices):
        MALE = 'M', _('Male')
        FEMALE = 'F',_('Female')

    dob = models.DateField(blank=False)
    address = models.OneToOneField('Address',on_delete=models.CASCADE,null=True) # null changed for testing purposes
    nationality = models.CharField(max_length=100, blank=False)
    sex = models.CharField(max_length=6,choices=Sex.choices)
    resume = models.ForeignKey('Resume', on_delete=models.CASCADE, null=True)

    class Meta:
        verbose_name = 'Job Seeker'
    
    def get_applied_jobs(self):
        return self.application_set.all()
    
    def get_resume(self):
        return self.resume


class Employer(User):
    """Model that represent an employer and inherits from User"""
    company = models.ForeignKey('Company', on_delete=models.CASCADE, null=False)
    is_company_admin = models.BooleanField(default=False)
    class Meta:
        verbose_name = 'Employer'
