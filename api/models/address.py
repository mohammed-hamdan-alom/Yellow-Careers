from django.db import models

class Address(models.Model):
    """Model that represents an address"""
    city = models.CharField(max_length=50,blank=False)
    post_code = models.CharField(max_length=50,blank=False)
    country = models.CharField(max_length=50,blank=False)