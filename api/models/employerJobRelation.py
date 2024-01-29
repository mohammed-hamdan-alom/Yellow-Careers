from django.db import models


class EmployerJobRelation (models.Model):
    employer = models.ForeignKey('Employer', on_delete=models.CASCADE, null=False)
    job = models.ForeignKey('Job', on_delete=models.CASCADE, null=False)