from django.test import TestCase
from api.models import JobSeeker, Address
from django.urls import reverse
from rest_framework import status
from django.core.serializers import serialize
from rest_framework.test import APIRequestFactory
from api.views.job_seeker_views import *

class JobSeekerViewTestCase(TestCase):
    
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
        self.job_seekers = [JobSeeker.objects.get(pk=1), 
                           JobSeeker.objects.get(pk=2)]
        
    def test_list_job_seekers(self):
        response = self.client.get(reverse('job-seeker-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.job_seekers))
    
    def test_retrieve_job_seeker(self):
        job_seeker = self.job_seekers[0]
        response = self.client.get(reverse('job-seeker-get', args=[job_seeker.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['resume'], job_seeker.resume.id)
        self.assertEqual(dict(response.data['address'])['id'], job_seeker.address.id)
        self.assertEqual(response.data['phone_number'], job_seeker.phone_number)
        self.assertEqual(response.data['nationality'], job_seeker.nationality)
        self.assertEqual(response.data['sex'], job_seeker.sex)

    def test_create_job_seeker(self):
        job_seeker_data = {
            "id": 3,
            "email": "test@example3.com",
            "first_name": "John",
            "last_name": "Doe",
            "other_names": "Charles",
            "phone_number": "08012345678",
            "dob": "1999-01-01",
            "nationality": "British",
            "sex": "M",
            "resume": 1,
            "address": {
                "city": "london",
                "post_code": "ew222",
                "country":"UK"
            }
        }
        factory = APIRequestFactory()
        request = factory.post(reverse('job-seeker-post'), job_seeker_data, format='json')

        view = JobSeekerCreateView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(JobSeeker.objects.count(), len(self.job_seekers) + 1)

    def test_create_job_seeker_without_address(self):
        job_seeker_data = {
            "id": 3,
            "email": "test@example3.com",
            "first_name": "John",
            "last_name": "Doe",
            "other_names": "Charles",
            "phone_number": "08012345678",
            "dob": "1999-01-01",
            "nationality": "British",
            "sex": "M",
            "resume": 1
        }

        response = self.client.post(reverse('job-seeker-post'), data=job_seeker_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(JobSeeker.objects.count(), len(self.job_seekers) + 1)

    def test_update_job_seeker(self):
        job_seeker = self.job_seekers[0]
        updated_job_seeker_data = {
            'email' : 'test@example.com',
            'password' : 'Password123',
            'first_name' : 'ChangedName',
            'last_name' : 'User',
            'phone_number' : '1234567890',
            'resume' : 1,
            'dob' : '1990-01-01',
            'nationality' : 'British',
            'sex' : 'M',
            'address' : {
                "city" : "london",
                "post_code" : "ew222",
                "country" : "UK"
            }
        }
        factory = APIRequestFactory()
        request = factory.put(reverse('job-seeker-put', args=[job_seeker.id]), updated_job_seeker_data, format='json')

        view = JobSeekerUpdateView.as_view()
        response = view(request, pk=job_seeker.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        job_seeker.refresh_from_db()
        self.assertEqual(job_seeker.first_name, updated_job_seeker_data['first_name'])
        self.assertEqual(job_seeker.last_name, updated_job_seeker_data['last_name'])
        self.assertEqual(job_seeker.phone_number, updated_job_seeker_data['phone_number'])
        self.assertEqual(job_seeker.resume.id, updated_job_seeker_data['resume'])
        self.assertEqual(job_seeker.nationality, updated_job_seeker_data['nationality'])
        self.assertEqual(job_seeker.sex, updated_job_seeker_data['sex'])
        self.assertEqual(job_seeker.address.city, updated_job_seeker_data['address']['city'])
        self.assertEqual(job_seeker.address.post_code, updated_job_seeker_data['address']['post_code'])
        self.assertEqual(job_seeker.address.country, updated_job_seeker_data['address']['country'])
        
    def test_update_job_seeker_without_address(self):
        job_seeker = self.job_seekers[0]
        updated_job_seeker_data = {
            'email' : 'test@example.com',
            'password' : 'Password123',
            'first_name' : 'ChangedName',
            'last_name' : 'User',
            'phone_number' : '1234567890',
            'resume' : 1,
            'dob' : '1990-01-01',
            'nationality' : 'British',
            'sex' : 'M',
        }
        response = self.client.put(reverse('job-seeker-put', args=[job_seeker.id]), updated_job_seeker_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        job_seeker.refresh_from_db()
        self.assertEqual(job_seeker.first_name, updated_job_seeker_data['first_name'])
        self.assertEqual(job_seeker.last_name, updated_job_seeker_data['last_name'])
        self.assertEqual(job_seeker.phone_number, updated_job_seeker_data['phone_number'])
        self.assertEqual(job_seeker.resume.id, updated_job_seeker_data['resume'])
        self.assertEqual(job_seeker.nationality, updated_job_seeker_data['nationality'])
        self.assertEqual(job_seeker.sex, updated_job_seeker_data['sex'])

    def test_delete_job_seeker(self):
        job_seeker = self.job_seekers[0]
        response = self.client.delete(reverse('job-seeker-put', args=[job_seeker.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(JobSeeker.objects.count(), len(self.job_seekers) - 1)
    
    def test_invalid_update_job_seeker(self):
        job_seeker = self.job_seekers[0]
        updated_job_seeker_data = {
            'email' : '',
            'password' : 'Password123',
            'first_name' : 'ChangedName',
            'last_name' : 'User',
            'phone_number' : '1234567890',
            'resume' : 1,
            'dob' : '1990-01-01',
            'nationality' : 'British',
            'sex' : 'M',
        }
        response = self.client.put(reverse('job-seeker-put', args=[job_seeker.id]), updated_job_seeker_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(JobSeeker.objects.count(), len(self.job_seekers))

    def test_invalid_address_update_job_seeker(self):
        job_seeker = self.job_seekers[0]
        updated_job_seeker_data = {
            'email' : 'test@example.com',
            'password' : 'Password123',
            'first_name' : 'ChangedName',
            'last_name' : 'User',
            'phone_number' : '1234567890',
            'resume' : 1,
            'dob' : '1990-01-01',
            'nationality' : 'British',
            'sex' : 'M',
            'address': {
                "city" : "12345",
                "post_code" : "12345",
                "country" : "12345"
            }
        }
        factory = APIRequestFactory()
        request = factory.put(reverse('job-seeker-put', args=[job_seeker.id]), updated_job_seeker_data, format='json')

        view = JobSeekerUpdateView.as_view()
        response = view(request, pk=job_seeker.id)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(JobSeeker.objects.count(), len(self.job_seekers))


    def test_create_invalid_job_seeker(self):
        job_seeker_data = {
            'email' : '',
            'password' : 'Password123',
            'first_name' : 'Test',
            'last_name' : 'User',
            'phone_number' : '1234567890',
            'resume' : 1,
            'dob' : '1990-01-01',
            'nationality' : 'British',
            'sex' : 'M',
        }
        response = self.client.post(reverse('job-seeker-post'), job_seeker_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(JobSeeker.objects.count(), len(self.job_seekers))

    def test_delete_invalid_job_seeker(self):
        response = self.client.delete(reverse('job-seeker-put', args=[100]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(JobSeeker.objects.count(), len(self.job_seekers))