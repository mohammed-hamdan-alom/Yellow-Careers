from django.db import models
from .helpers import Address
from .user import JobSeeker
from django.utils.translation import gettext as _


class SoftSkill(models.Model):
    skill = models.CharField(max_length=30)

class TechnicalSkill(models.Model):
    skill = models.CharField(max_length=30)

class Language(models.Model):
    language = models.CharField(max_length=30)

class Education(models.Model):
    ##other?
    class Levels(models.TextChoices):
        HIGH_SCHOOL = "HS" ,_('High School')
        BACHELORS = "BA" ,_('Bachelors')
        MASTERS = "MA" ,_('Masters')
        DOCTORATE = "PHD" ,_('Doctorate')
    start_date = models.DateTimeField(blank=False)
    end_date = models.DateTimeField(blank=False)
    address = models.OneToOneField(Address,on_delete=models.CASCADE,null=False)
    level = models.CharField(choices=Levels.choices) 
    institution = models.CharField(max_length=100)
    grade = models.CharField(max_length=15, blank=False)


class Resume(models.Model):
    github = models.URLField(max_length=250)
    linkedin = models.URLField(max_length=250)
    soft_skills = models.ManyToManyField(SoftSkill)
    technical_skills = models.ManyToManyField(TechnicalSkill)
    education = models.ManyToManyField(Education,on_delete=models.CASCADE)
    language = models.ManyToManyField(Language)
    job_seeker = models.ForeignKey(JobSeeker,on_delete=models.CASCADE,null=False)
    
    ##Like this or charfield?
    # class SoftSkills(models.TextChoices):
    #     COMMUNICATION = 'M', _('Male')
    #     TEAMWORK = 'F',_('Female')
    #     PROBLEM_SOLVING = 'M', _('Male')
    #     ADAPTABILITY = 'F',_('Female')
    #     LEADERSHIP = 'M', _('Male')
    #     TIME_MANAGEMENT = 'F',_('Female')
    #     DECISION_MAKING = 'M', _('Male')
    #     FLEXIBILITY = 'F',_('Female')
    #     RESPONSIBILITY = 'M', _('Male')
    #     EMPATHY = 'F',_('Female')

    

