from django.db import models
from .user import Employer

class Company(models.Model):
    """Model that represents a company"""
    company_name = models.CharField(max_length=100,blank=False)
    website = models.URLField(max_length=200,blank=True)
    about = models.CharField(max_length=1000,blank=True)  


