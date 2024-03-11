from django.test import TestCase
from api.models.user import *
from django.urls import reverse
from rest_framework import status

class EmployerViewTestCase(TestCase):

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
        self.employers = [Employer.objects.get(pk=3), 
                          Employer.objects.get(pk=4),
                          Employer.objects.get(pk=5)]
    
    def test_list_employers(self):
        response = self.client.get(reverse('employer-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.employers))

    def test_retrieve_employer(self):
        employer = self.employers[0]
        response = self.client.get(reverse('employer-get', args=[employer.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['company'], employer.company.id)
        self.assertEqual(response.data['is_company_admin'], employer.is_company_admin)
    
    def test_create_employer(self):
        employer_data = {
            'email' : 'test@email.com',
            'password' : 'Password123',
            'first_name' : 'Test',
            'last_name' : 'User',
            'phone_number' : '1234567890',
            'company' : 1,
            'is_company_admin' : False,
            
        }
        response = self.client.post(reverse('employer-post'), employer_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Employer.objects.count(), len(self.employers) + 1)
    
    def test_update_employer(self):
        employer = self.employers[0]
        updated_employer_data = {
            'email' : 'test@email.com',
            'password' : 'Password123',
            'first_name' : 'ChangedName',
            'last_name' : 'User',
            'phone_number' : '1234567890',
            'company' : 1,
            'is_company_admin' : False,
        }  
        response = self.client.put(reverse('employer-put', args=[employer.id]), updated_employer_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        employer.refresh_from_db()
        self.assertEqual(employer.first_name, updated_employer_data['first_name'])
        self.assertEqual(employer.last_name, updated_employer_data['last_name'])
        self.assertEqual(employer.phone_number, updated_employer_data['phone_number'])
        self.assertEqual(employer.company.id, updated_employer_data['company'])
        self.assertEqual(employer.is_company_admin, updated_employer_data['is_company_admin'])
    
    def test_delete_employer(self):
        employer = self.employers[0]
        response = self.client.delete(reverse('employer-put', args=[employer.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Employer.objects.count(), len(self.employers) - 1)

    def test_invalid_update_employer(self):
        employer = self.employers[0]
        updated_employer_data = {
            'email' : '',
            'password' : 'Password123',
            'first_name' : 'ChangedName',
            'last_name' : 'User',
            'phone_number' : '1234567890',
            'company' : 1,
            'is_company_admin' : False,
        }
        response = self.client.put(reverse('employer-put', args=[employer.id]), updated_employer_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Employer.objects.count(), len(self.employers))

    def test_create_invalid_employer(self):
        employer_data = {
            'email' : '',
            'password' : 'Password123',
            'first_name' : 'Test',
            'last_name' : 'User',
            'phone_number' : '1234567890',
            'company' : 1,
            'is_company_admin' : False,
        }
        response = self.client.post(reverse('employer-post'), employer_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Employer.objects.count(), len(self.employers))

    def test_delete_invalid_employer(self):
        response = self.client.delete(reverse('employer-put', args=[100]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Employer.objects.count(), len(self.employers))