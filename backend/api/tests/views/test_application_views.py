from django.test import TestCase
from api.models import User,JobSeeker,Application, Address, Resume
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from api.serializers import MyTokenObtainPairSerializer


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
        self.api_client = APIClient()

        self.user = User.objects.create(
            first_name="John",
            last_name="Doe",
            email="exampleuser100@example.com",
            phone_number="08012345678",
            is_active=True,
            password="Password123"
        )

        self.address = Address.objects.create(city='London', post_code='12345', country='UK')
        self.resume = Resume.objects.create(
            website="https://github.com/test",
            linkedin="https://linkedin.com/test",
            about="I am a test developer",
            experience="I have 5 years of experience")
        
        self.job_seeker = JobSeeker.objects.create(user_ptr_id=self.user.id,
            dob="1999-01-01",
            address=self.address,
            nationality="British",
            sex="M",
            resume=self.resume)
    
    def test_list_applications(self):
        response = self.client.get(reverse('application-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.applications))
    
    # def test_retrieve_application(self):
    #     application = self.applications[0]
    #     response = self.client.get(reverse('application-get', args=[application.id]))
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(response.data['job'], application.job.id)
    #     self.assertEqual(response.data['job_seeker'], application.job_seeker.id)
    
    def test_create_application(self):
        token = self._authenticate_user(user_email=self.job_seeker.email)
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

    def test_retrieve_job_seeker_application(self):
        application = self.applications[0]
        response = self.client.get(reverse('job-seeker-application-get', args=[application.job_seeker.id, application.job.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['job'], application.job.id)
        self.assertEqual(response.data['job_seeker'], application.job_seeker.id)

    @staticmethod
    def _authenticate_user(user_email):
        # Authenticate the user and obtain the authentication token
        client = APIClient()
        response = client.post(reverse('token_obtain_pair'), {'email': user_email, 'password': 'Password123'})