from django.db import models
from .resume import *

class ApplicationManager(models.Manager):
    def create(self, *args, **kwargs):
        resume = kwargs.get('resume')
        if resume:

            new_resume = Resume.objects.create(
                github = resume.github,
                linkedin = resume.linkedin,
                about = resume.about,
                experience = resume.experience
            )

            for language in Language.objects.filter(resume_id=resume.id):
                Language.objects.create(
                    language = language.language,
                    spoken_proficiency = language.spoken_proficiency,
                    written_proficiency = language.written_proficiency,
                    resume = new_resume
                )
            
            for education in Education.objects.filter(resume_id=resume.id):
                new_address = Address.objects.create(
                    city = education.address.city,
                    country = education.address.country,
                    post_code = education.address.post_code
                )
                Education.objects.create(
                    start_date = education.start_date,
                    end_date = education.end_date,
                    address = new_address,
                    level = education.level,
                    institution = education.institution,
                    grade = education.grade,
                    resume = new_resume
                )
            
            for soft_skill in SoftSkill.objects.filter(resume_id=resume.id):
                SoftSkill.objects.create(
                    skill = soft_skill.skill,
                    resume = new_resume
                )
            
            for technical_skill in TechnicalSkill.objects.filter(resume_id=resume.id):
                TechnicalSkill.objects.create(
                    skill = technical_skill.skill,
                    resume = new_resume
                )

            for professional_experience in ProfessionalExperience.objects.filter(resume_id=resume.id):
                new_address = Address.objects.create(
                    city = professional_experience.address.city,
                    country = professional_experience.address.country,
                    post_code = professional_experience.address.post_code
                )
                ProfessionalExperience.objects.create(
                    start_date = professional_experience.start_date,
                    end_date = professional_experience.end_date,
                    address = new_address,
                    company = professional_experience.company,
                    position = professional_experience.position,
                    description = professional_experience.description,
                    resume = new_resume
                )

            kwargs['resume'] = new_resume
        return super().create(*args, **kwargs)

class Application(models.Model):
    """Model that represents an application to a specific job"""
    class ApplicationStatus(models.TextChoices):
        READ = 'R', 'Read'
        UNREAD = 'U', 'Unread'
    
    class ApplicationDecision(models.TextChoices):
        ACCEPTED = 'A', 'Accepted'
        REJECTED = 'R', 'Rejected'
        UNDECIDED = 'U', 'Undecided'
    
    job_seeker = models.ForeignKey('JobSeeker', on_delete=models.CASCADE, null=False)
    resume = models.ForeignKey('Resume', on_delete=models.CASCADE, null=False)
    job = models.ForeignKey('Job', on_delete=models.CASCADE, null=False)
    date_applied = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=1, choices=ApplicationStatus.choices, default=ApplicationStatus.UNREAD)
    decision = models.CharField(max_length=1, choices=ApplicationDecision.choices, default=ApplicationDecision.UNDECIDED)

    objects = ApplicationManager()

    class Meta:
        unique_together = (('job_seeker', 'job'),)
    
    def delete(self):
        self.resume.delete()
        super().delete()
    

