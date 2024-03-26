from django.db import models
from .application import Application
from .employer_job_relation import EmployerJobRelation
from django.utils.translation import gettext as _

class Job(models.Model):
    """Model that represents a job"""
    class JobType(models.TextChoices):
        FULL_TIME = 'FT', _('Full time')
        PART_TIME = 'PT',_('Part time')
        INTERNSHIP = 'IN', _('Internship')
        TEMPORARY  = 'TM',_('Temporary')

    title = models.CharField(max_length=50,blank=False)
    description = models.CharField(max_length=1000,blank=False)
    salary = models.PositiveIntegerField(blank=True, null=True)
    address = models.OneToOneField('Address',blank=True,null=True, on_delete=models.CASCADE)
    job_type = models.CharField(max_length=20,choices=JobType.choices)

    def get_applications(self):
        return Application.objects.filter(job=self)
    
    def get_employers_ids(self):
        return EmployerJobRelation.objects.filter(job_id=self.id).values_list('employer', flat=True)
    
    def to_string(self):
        return f"{self.title} {self.description} {self.salary} {self.job_type}"