from django.test import TestCase
from api.models import Application
from django.urls import reverse
from rest_framework import status

class ApplicationViewTestCase(TestCase):
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
        self.applications = [Application.objects.get(pk=1), 
                             Application.objects.get(pk=2), 
                             Application.objects.get(pk=3),]
    
    def test_list_applications(self):
        response = self.client.get(reverse('application-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.applications))
    
    def test_retrieve_application(self):
        application = self.applications[0]
        response = self.client.get(reverse('application-get', args=[application.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['job'], application.job.id)
        self.assertEqual(response.data['job_seeker'], application.job_seeker.id)
    
    def test_create_application(self):
        application_data = {
            'job' : 3,
            'job_seeker' : 2,
            'resume' : 2,
        }
        response = self.client.post(reverse('application-post'), application_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Application.objects.count(), len(self.applications) + 1)
    
    def test_update_application(self):
        application = self.applications[0]
        updated_application_data = {
            'job' : 1,
            'job_seeker' : 1,
            'resume' : 2,
        }
        response = self.client.put(reverse('application-put', args=[application.id]), updated_application_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        application.refresh_from_db()
        self.assertEqual(application.job.id, updated_application_data['job'])
        self.assertEqual(application.job_seeker.id, updated_application_data['job_seeker'])
    
    def test_delete_application(self):
        application = self.applications[0]
        response = self.client.delete(reverse('application-put', args=[application.id]))
        print(response.status_code)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Application.objects.count(), len(self.applications) - 1)
    
    def test_invalid_update_application(self):
        application = self.applications[0]
        updated_application_data = {
            'job' : 10,
            'job_seeker' : 1,
            'resume' : 2,
        }
        response = self.client.put(reverse('application-put', args=[application.id]), updated_application_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Application.objects.count(), len(self.applications))
    
    def test_invalid_create_application(self):
        application_data = {
            'job' : 10,
            'job_seeker' : 1,
            'resume' : 2,
        }
        response = self.client.post(reverse('application-post'), application_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Application.objects.count(), len(self.applications))
    
    def test_invalid_delete_application(self):
        response = self.client.delete(reverse('application-put', args=[10]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Application.objects.count(), len(self.applications))