from django.db import models
class EmployerJobRelation (models.Model):
    """Model that represents a relation between an employer and a job"""
    employer = models.ForeignKey('Employer', on_delete=models.CASCADE, null=False)
    job = models.ForeignKey('Job', on_delete=models.CASCADE, null=False)
    class Meta:
        unique_together = ['employer', 'job']