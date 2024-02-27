from django.db import models
class SavedJobs (models.Model):
    """Model that represents a relation between an job_seeker and a job which the job_seeker has saved."""
    job_seeker = models.ForeignKey('JobSeeker', on_delete=models.CASCADE, null=False)
    job = models.ForeignKey('Job', on_delete=models.CASCADE, null=False)
    class Meta:
        unique_together = ['job_seeker', 'job']