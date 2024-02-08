from django.db import models

from api.models.user import JobSeeker

class Answer(models.Model):
    """Model that represents an answer to a job question"""
    application = models.ForeignKey('Application', on_delete=models.CASCADE, null=False)
    question = models.ForeignKey('Question', on_delete=models.CASCADE, null=False)
    answer = models.CharField(max_length=2000, blank=False)
    class Meta:
        unique_together = (('application', 'question'))