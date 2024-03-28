from django.test import TestCase
from api.models import SavedJobs
from django.urls import reverse
from rest_framework import status

class SavedJobsViewTestCase(TestCase):
    '''Test cases for the SavedJobs views.'''

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
    
    def test_list_saved_jobs(self):
        response = self.client.get(reverse('saved-jobs-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.saved_jobs))

    def test_retreive_saved_job(self):
        saved_job = self.saved_jobs[0]
        response = self.client.get(reverse('saved-jobs-get', args=[saved_job.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['job_seeker'], saved_job.job_seeker.id)
        self.assertEqual(response.data['job'], saved_job.job.id)

    def test_create_saved_job(self):
        saved_job_data = {
            'job_seeker' : 2,
            'job' : 1,
        }
        response = self.client.post(reverse('saved-jobs-create'), saved_job_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SavedJobs.objects.count(), len(self.saved_jobs) + 1)

    def test_delete_saved_job(self):
        saved_job = self.saved_jobs[0]
        delete_response = self.client.delete(reverse('saved-jobs-update', args=[saved_job.job_seeker.id, saved_job.job.id]))
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)

        # Try to retrieve the job
        retrieve_response = self.client.get(reverse('saved-jobs-get', args=[saved_job.id]))
        self.assertEqual(retrieve_response.status_code, status.HTTP_404_NOT_FOUND)

    def test_invalid_saved_job(self):
        saved_job_data = {
            'job_seeker' : 2,
            'job' : 1,
        }
        response = self.client.post(reverse('saved-jobs-create'), saved_job_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SavedJobs.objects.count(), len(self.saved_jobs) + 1)

        # Try to create the same job again
        response = self.client.post(reverse('saved-jobs-create'), saved_job_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(SavedJobs.objects.count(), len(self.saved_jobs) + 1)
        self.assertEqual(response.data['non_field_errors'][0], 'The fields job_seeker, job must make a unique set.')