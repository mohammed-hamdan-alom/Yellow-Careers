from django.db import models
from django.core.validators import RegexValidator


class Address(models.Model):
    """Model that represents an address"""
    city = models.CharField(max_length=50,blank=False, validators=[RegexValidator(r'^[a-zA-Z\s]*$')])
    post_code = models.CharField(max_length=50,blank=False,validators = [RegexValidator(r'^[a-zA-Z0-9\s]*$')])
    country = models.CharField(max_length=50,blank=False, validators=[RegexValidator(r'^[a-zA-Z\s]*$')])

    def to_string(self):
        return f"{self.city} {self.post_code} {self.country}"