from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext as _
from .company import Company
from .helpers import Address

class User(AbstractUser):

    first_name = models.CharField(max_length=50, blank=False)
    last_name = models.CharField(max_length=50, blank=False)
    other_names = models.CharField(max_length=50, blank=True)
    email = models.EmailField(unique=True, blank=False)
    #needs regex for phone number
    phone_number = models.PositiveIntegerField(unique=True,blank=False)
    

class JobSeeker(User):
    class Sex(models.TextChoices):
        MALE = 'M', _('Male')
        FEMALE = 'F',_('Female')

    dob = models.DateTimeField(blank=False)
    address = models.OneToOneField(Address,on_delete=models.CASCADE,null=False)
    nationality = models.CharField(max_length=100, blank=False)
    sex = models.CharField(choices=Sex.choices)
    

class Employer(User):
    company = models.ForeignKey(Company,on_delete=models.CASCADE,null=False)


    
    


    

    