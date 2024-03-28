from django.test import TestCase
from api.models import Company, Job, EmployerJobRelation
from django.urls import reverse
from rest_framework import status

class CompanyViewTestCase(TestCase):
    '''Test case for the Company views.'''

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
        self.company = [Company.objects.get(pk=1), 
                        Company.objects.get(pk=2)]
    
    def test_list_companies(self):
        response = self.client.get(reverse('company-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.company))
    
    def test_retrieve_company(self):
        company = self.company[0]
        response = self.client.get(reverse('company-get', args=[company.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['company_name'], company.company_name)
        self.assertEqual(response.data['website'], company.website)
        self.assertEqual(response.data['about'], company.about)
    
    def test_create_company(self):
        company_data = {
            'company_name' : 'Meta',
            'website' : 'http://www.meta.com',
            'about' : 'We are a tech company'
        }
        response = self.client.post(reverse('company-post'), company_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Company.objects.count(), len(self.company) + 1)
    
    def test_update_company(self):
        company = self.company[0]
        updated_company_data = {
            'company_name' : 'Amazon',
            'website' : 'http://www.amazon.com',
            'about' : 'We are a tech company'
        }
        response = self.client.put(reverse('company-put', args=[company.id]), updated_company_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        company.refresh_from_db()
        self.assertEqual(company.company_name, updated_company_data['company_name'])
        self.assertEqual(company.website, updated_company_data['website'])
        self.assertEqual(company.about, updated_company_data['about'])
    
    def test_delete_company(self):
        company = self.company[0]
        response = self.client.delete(reverse('company-put', args=[company.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Company.objects.count(), len(self.company) - 1)
    
    def test_invalid_update_company(self):
        company = self.company[0]
        updated_company_data = {
            'company_name' : '',
            'website' : 'http://www.amazon.com',
            'about' : 'We are a tech company'
        }
        response = self.client.put(reverse('company-put', args=[company.id]), updated_company_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Company.objects.count(), len(self.company))
    
    def test_invalid_create_company(self):
        company_data = {
            'company_name' : '',
            'website' : 'http://www.amazon.com',
            'about' : 'We are a tech company'
        }
        response = self.client.post(reverse('company-post'), company_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Company.objects.count(), len(self.company))
    
    def test_invalid_delete_company(self):
        response = self.client.delete(reverse('company-put', args=[100]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Company.objects.count(), len(self.company))

    def test_get_company_of_job(self):
        job = Job.objects.get(pk=1)
        response = self.client.get(reverse('job-company', args=[job.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        relation = EmployerJobRelation.objects.filter(job=job).first()
        self.assertEqual(response.data['company_name'], relation.employer.company.company_name)