from django.db import models

class Company(models.Model):
    """Model that represents a company"""
    company_name = models.CharField(max_length=100,blank=False)
    website = models.URLField(max_length=200,blank=True)
    about = models.CharField(max_length=1000,blank=True)  

    # def __str__(self):
    #     return self.company_name

    # def delete(self):
    #     self.address.delete()
    #     super().delete()
    
    # def employees(self):
    #     return self.employer_set.all()

