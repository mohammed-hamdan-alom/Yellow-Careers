from django.db import models
from .address import Address
from .user import JobSeeker
from django.utils.translation import gettext as _


class SoftSkill(models.Model):
    """Model that represents a soft skill"""
    skill = models.CharField(max_length=30)
    resume = models.ForeignKey('Resume',on_delete=models.CASCADE,null=False)

    def to_string(self):
        return f"{self.skill}"

class TechnicalSkill(models.Model):
    """Model that represents a technical skill"""
    skill = models.CharField(max_length=30)
    resume = models.ForeignKey('Resume',on_delete=models.CASCADE,null=False)

    def to_string(self):
        return f"{self.skill}"

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

    def to_string(self):
        return f"{self.language}"

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
    # course_name = models.CharField(max_length=100, default=None)
    level = models.CharField(max_length=15,choices=Levels.choices) 
    institution = models.CharField(max_length=100)
    grade = models.CharField(max_length=15, blank=False)
    resume = models.ForeignKey('Resume',on_delete=models.CASCADE,null=False)

    def to_string(self):
        return f"{self.course_name}"


class ProfessionalExperience(models.Model):
    """Model that represents a professional experience"""
    start_date = models.DateField(blank=False)
    end_date = models.DateField(blank=False)
    address = models.OneToOneField(Address,on_delete=models.CASCADE,null=False)
    company = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    description = models.TextField(max_length=2000,blank=True)
    resume = models.ForeignKey('Resume',on_delete=models.CASCADE,null=False)

    def to_string(self):
        return f"{self.position} {self.description}"


class Resume(models.Model):
    """Model that represents a resume"""
    github = models.URLField(max_length=250,blank=True)
    linkedin = models.URLField(max_length=250,blank=True)
    about = models.TextField(max_length=2000,blank=True)
    experience = models.TextField(max_length=2000,blank=True)

    def get_jobseeker(self):
        return JobSeeker.objects.get(resume_id=self.id)
    
    def get_education(self):
        return self.education_set.all()
    
    def get_technical_skills(self):
        return self.technicalskill_set.all()
    
    def get_soft_skills(self):
        return self.softskill_set.all()
    
    def get_languages(self):
        return self.language_set.all()
    
    def get_professional_experience(self):
        return self.professionalexperience_set.all()

    def to_string(self):
        # education_strings = [education.to_string() for education in self.get_education()]
        education_strings = []
        skills_strings = [skills.to_string() for skills in self.get_technical_skills()] + [skills.to_string() for skills in self.get_soft_skills()]
        language_strings = [language.to_string() for language in self.get_languages()]
        experience_sting = [experience.to_string() for experience in self.get_professional_experience()]
        return ' '.join(education_strings + skills_strings + language_strings + experience_sting)