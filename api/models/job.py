from django.db import models
from .user import User
from django.utils.translation import gettext as _


class Job(models.Model):
    class JobType(models.TextChoices):
        FULL_TIME = 'FT', _('Full time')
        PART_TIME = 'PT',_('Part time')
        INTERNSHIP = 'IN', _('Internship')
        TEMPORARY  = 'TM',_('Temporary')

    title = models.CharField(max_length=50,blank=False)
    description = models.CharField(max_length=1000,blank=False)
    salary = models.PositiveIntegerField(blank=True)
    location = models.OneToOneField('Address',blank=True,on_delete=models.CASCADE)
    job_type = models.CharField(max_length=20,choices=JobType.choices)
    company = models.ForeignKey('Company',on_delete=models.CASCADE,)

    ##questions field we need to add
