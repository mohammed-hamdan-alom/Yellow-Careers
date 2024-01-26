from django.db import models
from .user import User

class Company(models.Model):
    company_name = models.CharField(max_length=100,blank=False)

    ##TO DO: should we do it like this?
    admin = models.ForeignKey(User,on_delete=models.SET_NULL, null=False)
