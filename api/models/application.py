from django.db import models
from .resume import *

class ApplicationManager(models.Manager):
    def create(self, *args, **kwargs):
        resume = kwargs.get('resume')
        if resume:
            # Duplicate the resume instance
            old_resume_pk = resume.pk
            resume.pk = None
            resume.save()

            # Duplicate related Language, Education, SoftSkill, and TechnicalSkill instances
            for language in Language.objects.filter(resume_id=old_resume_pk):
                language.pk = None
                language.resume = resume
                language.save()

            for education in Education.objects.filter(resume_id=old_resume_pk):
                education.pk = None
                education.resume = resume
                education.save()

            for soft_skill in SoftSkill.objects.filter(resume_id=old_resume_pk):
                soft_skill.pk = None
                soft_skill.resume = resume
                soft_skill.save()

            for technical_skill in TechnicalSkill.objects.filter(resume_id=old_resume_pk):
                technical_skill.pk = None
                technical_skill.resume = resume
                technical_skill.save()

            kwargs['resume'] = resume
        return super().create(*args, **kwargs)

class Application(models.Model):
    """Model that represents an application to a specific job"""
    job_seeker = models.ForeignKey('JobSeeker', on_delete=models.CASCADE, null=False)
    resume = models.ForeignKey('Resume', on_delete=models.CASCADE, null=False)
    job = models.ForeignKey('Job', on_delete=models.CASCADE, null=False)
    date_applied = models.DateField(auto_now_add=True)

    objects = ApplicationManager()

    class Meta:
        unique_together = (('job_seeker', 'job'),)
    
    def delete(self):
        self.resume.delete()
        super().delete()
    

