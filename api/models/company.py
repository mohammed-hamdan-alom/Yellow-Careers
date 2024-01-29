from django.db import models
class Company(models.Model):
    company_name = models.CharField(max_length=100,blank=False)
    admin = models.ForeignKey('Employer',on_delete=models.CASCADE, null=False,related_name='admin_companies')
    website = models.URLField(max_length=200,blank=True)        

