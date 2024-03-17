from django.db import models
from django.utils.translation import gettext as _

class InvitedEmployer(models.Model):
    email = models.EmailField(unique=True, blank=False)
    code = models.CharField(max_length=50, blank=False)
    company = models.ForeignKey('Company', on_delete=models.CASCADE, null=False)