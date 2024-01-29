from django.db import models

class Application(models.Model):
    job_seeker = models.ForeignKey('JobSeeker', on_delete=models.CASCADE, null=False)
    resume = models.ForeignKey('Resume', on_delete=models.CASCADE, null=False)
    job = models.ForeignKey('Job', on_delete=models.CASCADE, null=False)
    date_applied = models.DateField(auto_now_add=True)
    #question answers
    class Meta:
        unique_together = (('job_seeker', 'job'),)