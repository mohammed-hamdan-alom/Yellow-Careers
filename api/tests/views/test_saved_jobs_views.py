from django.test import TestCase
from api.models import SavedJobs
from django.urls import reverse
from rest_framework import status

class SavedJobsViewTestCase(TestCase):

    fixtures = ['api/tests/fixtures/addresses.json',
                'api/tests/fixtures/answers.json',
                'api/tests/fixtures/applications.json',
                'api/tests/fixtures/companies.json',
                'api/tests/fixtures/employers.json',
                'api/tests/fixtures/jobs.json',
                'api/tests/fixtures/jobseekers.json',
                'api/tests/fixtures/questions.json',
                'api/tests/fixtures/resumes.json',
                'api/tests/fixtures/users.json',]
    
    def setUp(self):
        self.saved_jobs = [SavedJobs.objects.get(pk=1),
                        SavedJobs.objects.get(pk=2), 
                        SavedJobs.objects.get(pk=3)]
        