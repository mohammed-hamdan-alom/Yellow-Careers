from django.db import models

class Question(models.Model):
    """Model that represents a question for a specific job"""
    job = models.ForeignKey('Job', on_delete=models.CASCADE, null=False)
    question = models.CharField(max_length=400, blank=False)