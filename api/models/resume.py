from django.db import models
from .address import Address
from .user import JobSeeker
from django.utils.translation import gettext as _


class SoftSkill(models.Model):
    """Model that represents a soft skill"""
    skill = models.CharField(max_length=30)
    resume = models.ForeignKey('Resume',on_delete=models.CASCADE,null=False)

class TechnicalSkill(models.Model):
    """Model that represents a technical skill"""
    skill = models.CharField(max_length=30)
    resume = models.ForeignKey('Resume',on_delete=models.CASCADE,null=False)

class Language(models.Model):
    """Model that represents a language"""
    class Proficiency(models.TextChoices):
        BASIC = 'B', _('Basic')
        INTERMEDIATE = 'I',_('Intermediate')
        ADVANCED = 'A', _('Advanced')
        FLUENT = 'F',_('Fluent')
    language = models.CharField(max_length=30)
    spoken_proficiency = models.CharField(max_length=1,choices=Proficiency.choices)
    written_proficiency = models.CharField(max_length=1,choices=Proficiency.choices)
    resume = models.ForeignKey('Resume',on_delete=models.CASCADE,null=False)

class Education(models.Model):
    """Model that represents an education"""
    class Levels(models.TextChoices):
        HIGH_SCHOOL = "HS" ,_('High School')
        BACHELORS = "BA" ,_('Bachelors')
        MASTERS = "MA" ,_('Masters')
        DOCTORATE = "PHD" ,_('Doctorate')
    start_date = models.DateField(blank=False)
    end_date = models.DateField(blank=False)
    address = models.OneToOneField(Address,on_delete=models.CASCADE,null=False)
    level = models.CharField(max_length=15,choices=Levels.choices) 
    institution = models.CharField(max_length=100)
    grade = models.CharField(max_length=15, blank=False)
    resume = models.ForeignKey('Resume',on_delete=models.CASCADE,null=False)



class Resume(models.Model):
    """Model that represents a resume"""
    github = models.URLField(max_length=250,blank=True)
    linkedin = models.URLField(max_length=250,blank=True)
    about = models.TextField(max_length=2000,blank=True)
    experience = models.TextField(max_length=2000,blank=True)
    