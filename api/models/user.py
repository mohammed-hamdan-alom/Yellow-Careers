from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext as _
from .address import Address
from .managers import CustomUserManager
from django.core.validators import RegexValidator


class User(AbstractUser):
    """Custom user model with email as primary key"""
    username = None
    first_name = models.CharField(max_length=50, blank=False)
    last_name = models.CharField(max_length=50, blank=False)
    other_names = models.CharField(max_length=50, blank=True)
    email = models.EmailField(unique=True, blank=False)
    phone_number = models.CharField(blank=False, max_length=15, validators=[RegexValidator(r'^\+?1?\d{9,15}$')])
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    class Meta:
        ordering = ['last_name', 'first_name']
    def __str__(self):
        return self.first_name + " " + self.last_name

class JobSeeker(User):
    """Model that represents a job seeker and inherits from User"""
    class Sex(models.TextChoices):
        MALE = 'M', _('Male')
        FEMALE = 'F',_('Female')

    dob = models.DateField(blank=False)
    address = models.OneToOneField(Address,on_delete=models.CASCADE,null=False)
    nationality = models.CharField(max_length=100, blank=False)
    sex = models.CharField(max_length=6,choices=Sex.choices)
    resume = models.ForeignKey('Resume',on_delete=models.CASCADE,null=True)
    

class Employer(User):
    """Model that represent an employer and inherits from User"""
    company = models.ForeignKey('Company', on_delete=models.CASCADE, null=False)
    is_company_admin = models.BooleanField(default=False)



    