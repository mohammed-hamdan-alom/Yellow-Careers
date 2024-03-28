from django.test import TestCase
from api.models import EmployerJobRelation
from django.urls import reverse
from rest_framework import status

class EmployerJobRelationViewTestCase(TestCase):
    '''Test case for the EmployerJobRelation views.'''
    
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
        self.employer_job_relations = [EmployerJobRelation.objects.get(pk=1), 
                                      EmployerJobRelation.objects.get(pk=2), 
                                      EmployerJobRelation.objects.get(pk=3),
                                      EmployerJobRelation.objects.get(pk=4)]


    def test_list_employer_job_relations(self):
        response = self.client.get(reverse('employer-job-relation-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.employer_job_relations))
    
    def test_retrieve_employer_job_relation(self):
        employer_job_relation = self.employer_job_relations[0]
        response = self.client.get(reverse('employer-job-relation-get', args=[employer_job_relation.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['employer'], employer_job_relation.employer.id)
        self.assertEqual(response.data['job'], employer_job_relation.job.id)
    
    def test_create_employer_job_relation(self):
        employer_job_relation_data = {
            'employer' : 3,
            'job' : 2,
        }
        response = self.client.post(reverse('employer-job-relation-post'), employer_job_relation_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(EmployerJobRelation.objects.count(), len(self.employer_job_relations) + 1)
    
    def test_update_employer_job_relation(self):
        employer_job_relation = self.employer_job_relations[0]
        updated_employer_job_relation_data = {
            'employer' : 3,
            'job' : 2,
        }
        response = self.client.put(reverse('employer-job-relation-put', args=[employer_job_relation.id]), updated_employer_job_relation_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        employer_job_relation.refresh_from_db()
        self.assertEqual(employer_job_relation.employer.id, updated_employer_job_relation_data['employer'])
        self.assertEqual(employer_job_relation.job.id, updated_employer_job_relation_data['job'])

    def test_delete_employer_job_relation(self):
        employer_job_relation = self.employer_job_relations[0]
        response = self.client.delete(reverse('employer-job-relation-delete', args=[employer_job_relation.job.id, employer_job_relation.employer.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(EmployerJobRelation.objects.count(), len(self.employer_job_relations) - 1)

    def test_invalid_update_employer_job_relation(self):
        employer_job_relation = self.employer_job_relations[0]
        updated_employer_job_relation_data = {
            'employer' : 1,
        }
        response = self.client.put(reverse('employer-job-relation-put', args=[employer_job_relation.id]), updated_employer_job_relation_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        employer_job_relation.refresh_from_db()
        self.assertNotEqual(employer_job_relation.employer.id, updated_employer_job_relation_data['employer'])

    def test_invalid_create_employer_job_relation(self):
        employer_job_relation_data = {
            'employer' : 3,
        }
        response = self.client.post(reverse('employer-job-relation-post'), employer_job_relation_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(EmployerJobRelation.objects.count(), len(self.employer_job_relations))

    def test_invalid_delete_employer_job_relation(self):
        response = self.client.delete(reverse('employer-job-relation-delete', args=[100, 100]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(EmployerJobRelation.objects.count(), len(self.employer_job_relations))

    
