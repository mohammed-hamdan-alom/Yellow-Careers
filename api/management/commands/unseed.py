from django.core.management.base import BaseCommand, CommandError
from api.models import User, JobSeeker, Employer, Job, Application, Resume, SoftSkill, TechnicalSkill, Language, Education, ProfessionalExperience, Address, Company, Question, Answer, EmployerJobRelation

class Command(BaseCommand):
    help = 'Unseeds the database'

    def handle(self, *args, **options):
        '''Deletes all data from the database, except for superusers and staff members.'''
        User.objects.exclude(is_staff=True, is_superuser=True).delete()
        JobSeeker.objects.all().delete()
        Employer.objects.all().delete()
        Job.objects.all().delete()
        Application.objects.all().delete()
        Resume.objects.all().delete()
        SoftSkill.objects.all().delete()
        TechnicalSkill.objects.all().delete()
        Language.objects.all().delete()
        Education.objects.all().delete()
        ProfessionalExperience.objects.all().delete()
        Address.objects.all().delete()
        Company.objects.all().delete()
        Question.objects.all().delete()
        Answer.objects.all().delete()
        EmployerJobRelation.objects.all().delete()
        