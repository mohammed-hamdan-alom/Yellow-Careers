from django.db import models
class Company(models.Model):
    company_name = models.CharField(max_length=100,blank=False)
    website = models.URLField(max_length=200,blank=True)        

