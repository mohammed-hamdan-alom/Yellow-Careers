from django.test import TestCase
from api.models import User,JobSeeker,Application, Address, Resume, Employer
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, force_authenticate
from rest_framework.authtoken.models import Token
from rest_framework.test import APIRequestFactory
from api.views import ApplicationRetrieveView
from api.models.job import Job
from api.views.application_views import ApplicationsFromJobListView


class ApplicationViewTestCase(TestCase):
    '''Test case for the Application views.'''
    
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
        self.token = Token.objects.create(user=self.user)

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
        
        self.request_factory = APIRequestFactory()
    
    def test_list_applications(self):
        response = self.client.get(reverse('application-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.applications))
    
    
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

    def test_retrieve_application_by_job_seeker(self):
        '''Test retrieving an application by the job seeker who made the application.'''
        application = Application.objects.get(pk=1)  # Assuming an Application with id 1 exists
        factory = APIRequestFactory()
        request = factory.get(reverse('application-get', args=[application.id]))
        force_authenticate(request, user=application.job_seeker)
        view = ApplicationRetrieveView.as_view()
        response = view(request, pk=application.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], application.id)

    
    def test_retrieve_application_by_unauthorized_job_seeker(self):
        '''Test retrieving an application by a job seeker who did not make the application.'''
        application = Application.objects.get(pk=1)  
        job_seeker = JobSeeker.objects.get(pk=2)  
        factory = APIRequestFactory()
        request = factory.get(reverse('application-get', args=[application.id]))
        force_authenticate(request, user=job_seeker)
        view = ApplicationRetrieveView.as_view()
        response = view(request, pk=application.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_application_by_authorized_employer(self):
        '''Test retrieving an application by an authorized employer.'''
        application = Application.objects.get(pk=1) 
        employer = Employer.objects.get(pk=3) 
        factory = APIRequestFactory()
        request = factory.get(reverse('application-get', args=[application.id]))
        force_authenticate(request, user=employer)
        view = ApplicationRetrieveView.as_view()
        response = view(request, pk=application.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], application.id)

    def test_retrieve_application_by_unauthorized_employer(self):
        '''Test retrieving an application by an unauthorized employer.'''
        application = Application.objects.get(pk=1)  
        employer = Employer.objects.get(pk=4)  
        factory = APIRequestFactory()
        request = factory.get(reverse('application-get', args=[application.id]))
        force_authenticate(request, user=employer)
        view = ApplicationRetrieveView.as_view()
        response = view(request, pk=application.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_application_by_employer_in_company_but_not_associated_with_job(self):
        """Test retrieving an application by an employer in the same company but not associated with the job."""
        application = Application.objects.get(pk=3)  
        employer = Employer.objects.get(pk=5)  
        factory = APIRequestFactory()
        request = factory.get(reverse('application-get', args=[application.id]))
        force_authenticate(request, user=employer)
        view = ApplicationRetrieveView.as_view()
        response = view(request, pk=application.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_retrieve_nonexistent_application(self):
        '''Test retrieving an application that does not exist.'''
        job_seeker = JobSeeker.objects.get(pk=1)  
        factory = APIRequestFactory()
        request = factory.get(reverse('application-get', args=[100]))
        force_authenticate(request, user=job_seeker)
        view = ApplicationRetrieveView.as_view()
        response = view(request, pk=100)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_application_unauthenticated(self):
        '''Test retrieving an application by an unauthenticated user.'''
        application = Application.objects.get(pk=1) 
        factory = APIRequestFactory()
        request = factory.get(reverse('application-get', args=[application.id]))
        view = ApplicationRetrieveView.as_view()
        response = view(request, pk=application.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_list_applications_from_job_by_authorized_employer(self):
        '''Test retrieving the application list from a job by an authorized employer.'''
        job = Job.objects.get(pk=1) 
        employer = Employer.objects.get(pk=3)
        factory = APIRequestFactory()
        request = factory.get(reverse('application-all-get', args=[job.id]))
        force_authenticate(request, user=employer)
        view = ApplicationsFromJobListView.as_view()
        response = view(request, job_id=job.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_applications_from_job_by_authorized_employer_with_job_seeker_without_address(self):
        """Test retrieving the application list from a job by an authorized employer with a job without an address."""
        resume=Resume.objects.get(pk=2)
        job_seeker = JobSeeker.objects.create(
            first_name =  'John',
            last_name = 'Doe',
            email = 'noaddress@example.com',
            phone_number = '08012345678',
            is_active = True,
            dob = "1980-04-01",
            nationality = "Indian",
            sex = "F",
            resume = resume
        )
        Application.objects.create(job=Job.objects.get(pk=1), job_seeker=job_seeker, resume=resume)
        job = Job.objects.get(pk=1) 
        employer = Employer.objects.get(pk=3)
        factory = APIRequestFactory()
        request = factory.get(reverse('application-all-get', args=[job.id]))
        force_authenticate(request, user=employer)
        view = ApplicationsFromJobListView.as_view()
        response = view(request, job_id=job.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_applications_from_job_by_authorized_employer_with_job_without_description(self):
        """Test retrieving the application list from a job by an authorized employer with a job without a description."""
        resume=Resume.objects.create(website="", linkedin="", about="", experience="")
        job_seeker = JobSeeker.objects.create(
            first_name =  'John',
            last_name = 'Doe',
            email = 'noaddress@example.com',
            phone_number = '08012345678',
            is_active = True,
            dob = "1980-04-01",
            nationality = "Indian",
            sex = "F",
            resume = resume
        )
        Application.objects.create(job=Job.objects.get(pk=1), job_seeker=job_seeker, resume=resume)
        job = Job.objects.get(pk=1) 
        employer = Employer.objects.get(pk=3)
        factory = APIRequestFactory()
        request = factory.get(reverse('application-all-get', args=[job.id]))
        force_authenticate(request, user=employer)
        view = ApplicationsFromJobListView.as_view()
        response = view(request, job_id=job.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_list_applications_from_job_by_unauthorized_employer(self):
        '''Test retrieving the application list from a job by an unauthorized employer.'''
        job = Job.objects.get(pk=1)
        employer = Employer.objects.get(pk=4)
        factory = APIRequestFactory()
        request = factory.get(reverse('application-all-get', args=[job.id]))
        force_authenticate(request, user=employer)
        view = ApplicationsFromJobListView.as_view()
        response = view(request, job_id=job.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_applications_from_job_unauthenticated(self):
        '''Test retrieving the application list from a job by an unauthenticated user.'''
        job = Job.objects.get(pk=1) 
        factory = APIRequestFactory()
        request = factory.get(reverse('application-all-get', args=[job.id]))
        view = ApplicationsFromJobListView.as_view()
        response = view(request, job_id=job.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_retrieve_applications_by_employer_in_company_but_not_associated_with_job(self):
        """Test retrieving an application by an employer in the same company but not associated with the job."""
        job = Job.objects.get(pk=3)  
        employer = Employer.objects.get(pk=5)  
        factory = APIRequestFactory()
        request = factory.get(reverse('application-all-get', args=[job.id]))
        force_authenticate(request, user=employer)
        view = ApplicationsFromJobListView.as_view()
        response = view(request, job_id=job.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_applications_by_job_seeker(self):
        '''Test retrieving applications by an unauthorized job seeker.'''
        job_seeker = JobSeeker.objects.get(pk=2)  
        factory = APIRequestFactory()
        request = factory.get(reverse('application-all-get', args=[1]))
        force_authenticate(request, user=job_seeker)
        view = ApplicationsFromJobListView.as_view()
        response = view(request, job_id=1)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)