from django.db import models
from .helpers import Address
from .user import JobSeeker
from django.utils.translation import gettext as _


class SoftSkill(models.Model):
    skill = models.CharField(max_length=30)

class TechnicalSkill(models.Model):
    skill = models.CharField(max_length=30)

class Language(models.Model):
    class Proficiency(models.TextChoices):
        BASIC = 'B', _('Basic')
        INTERMEDIATE = 'I',_('Intermediate')
        ADVANCED = 'A', _('Advanced')
        FLUENT = 'F',_('Fluent')
    language = models.CharField(max_length=30)
    spoken_proficiency = models.CharField(max_length=1,choices=Proficiency.choices)
    written_proficiency = models.CharField(max_length=1,choices=Proficiency.choices)

class Education(models.Model):
    class Levels(models.TextChoices):
        HIGH_SCHOOL = "HS" ,_('High School')
        BACHELORS = "BA" ,_('Bachelors')
        MASTERS = "MA" ,_('Masters')
        DOCTORATE = "PHD" ,_('Doctorate')
    start_date = models.DateTimeField(blank=False)
    end_date = models.DateTimeField(blank=False)
    address = models.OneToOneField(Address,on_delete=models.CASCADE,null=False)
    level = models.CharField(max_length=15,choices=Levels.choices) 
    institution = models.CharField(max_length=100)
    grade = models.CharField(max_length=15, blank=False)


class Resume(models.Model):
    github = models.URLField(max_length=250)
    linkedin = models.URLField(max_length=250)
    soft_skills = models.ManyToManyField(SoftSkill)
    technical_skills = models.ManyToManyField(TechnicalSkill)
    education = models.ManyToManyField(Education)
    language = models.ManyToManyField(Language)
    
