from django.test import TestCase
from rest_framework.test import  force_authenticate, APIRequestFactory
from api.models import Job, Employer, Application, SavedJobs, EmployerJobRelation, Address
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from api.views.job_views import *

class JobViewTestCase(TestCase):
    '''Test case for the Job views.'''
    
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

        self.jobs = [Job.objects.get(pk=1), 
                    Job.objects.get(pk=2),
                    Job.objects.get(pk=3)]
        
        self.company_admin = Employer.objects.get(pk=3)
        self.employee = Employer.objects.get(pk=4)
        self.token = Token.objects.get_or_create(user=self.employee)

    def test_create_job(self):
        '''Test creating a job.'''

        address_data = {
            "city": "london",
            "post_code": "ew222",
            "country":"UK"
        }
        new_address = Address.objects.create(**address_data)
        job_data = {
            "title": "test",
            "description": "test",
            "job_type": "FT",
            "salary": "1000",
            "address":address_data
        }


        factory = APIRequestFactory()
        request = factory.post(reverse('create_job'), job_data, format='json')

        force_authenticate(request,user=self.employee)

        view = JobCreationView.as_view()
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Job.objects.count(), len(self.jobs) + 1)

    def test_invalid_create_job(self):
        '''Test creating a job with invalid data.'''
        job_data = {
            'title': 'Software Developer',
            'description': 'Develop software',
            'salary': 100000,
            'address': 4,
            'job_type': 'FT',
        }
        response = self.client.post(reverse('create_job'), job_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_applied_list_jobs(self):
        '''Test list of jobs applied by a job seeker.'''
        response = self.client.get(reverse('job-seeker-applications', args=[1]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        job_seeker1_applications = Application.objects.filter(job_seeker=1)
        self.assertEqual(len(response.data), len(job_seeker1_applications))
    
    def test_invalid_applied_list_jobs(self):
        '''Test list of jobs applied by a job seeker with invalid job seeker id.'''
        response = self.client.get(reverse('job-seeker-applications', args=[100]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_saved_list_jobs(self):
        '''Test list of jobs saved by a job seeker.'''
        response = self.client.get(reverse('job-seeker-saved-jobs', args=[1]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        job_seeker1_saved_jobs = SavedJobs.objects.filter(job_seeker=1)
        self.assertEqual(len(response.data), len(job_seeker1_saved_jobs))

    def test_invalid_saved_list_jobs(self):
        '''Test list of jobs saved by a job seeker with invalid job seeker id.'''
        response = self.client.get(reverse('job-seeker-saved-jobs', args=[100]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_list_jobs(self):
        '''Test list of all jobs.'''
        response = self.client.get(reverse('all_jobs'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(Job.objects.all()))

    def test_invalid_list_jobs(self):
        '''Test list of all jobs with invalid job id.'''
        response = self.client.get(reverse('all_jobs'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(Job.objects.all()))

    def test_retrieve_job(self):
        '''Test retrieving a job.'''
        address_data = {
            "city": "london",
            "post_code": "ew222",
            "country":"UK"
        }
        new_address = Address.objects.create(**address_data)
        job_data = {
            "title": "test",
            "description": "test",
            "job_type": "FT",
            "salary": 1000,
        }
        new_job = Job.objects.create(address=new_address,**job_data)
        new_employer_job_relation = EmployerJobRelation.objects.create(
            employer=self.employee,
            job=new_job
        )
        
        factory = APIRequestFactory()
        request = factory.get(reverse('get_job', args=[new_job.id]))

        force_authenticate(request,user=self.employee)

        view = JobRetrieveView.as_view()
        response = view(request,pk=new_job.id)
        
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], new_job.title)
        self.assertEqual(response.data['description'], new_job.description)
        self.assertEqual(response.data['salary'], new_job.salary)
        self.assertEqual(response.data['address']['id'], new_job.address.id)
        self.assertEqual(response.data['job_type'], new_job.job_type)

    def test_invalid_retrieve_job(self):
        '''Test retrieving a job with invalid job id.'''
        response = self.client.get(reverse('get_job', args=[100]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_employee_active_list_jobs(self):
        '''Test list of active jobs of an employer.'''
        response = self.client.get(reverse('view-employer-active-jobs', args=[self.employee.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        employer_jobs = [relation.job for relation in EmployerJobRelation.objects.filter(employer=self.employee) if not relation.job.isArchived]
        self.assertEqual(len(response.data), len(employer_jobs))

    def test_employee_archived_list_jobs(self):
        '''Test list of archived jobs of an employer.'''
        response = self.client.get(reverse('view-employer-archived-jobs', args=[self.employee.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        employer_jobs = [relation.job for relation in EmployerJobRelation.objects.filter(employer=self.employee) if relation.job.isArchived]
        self.assertEqual(len(response.data), len(employer_jobs))

    def test_invalid_employee_list_archived_jobs(self):
        '''Test list of jobs of an employer with invalid employer id.'''
        response = self.client.get(reverse('view-employer-archived-jobs', args=[100]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_company_admin_list_jobs(self):
        '''Test list of active jobs of an admin.'''
        response = self.client.get(reverse('view-admin-active-jobs', args=[self.company_admin.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        employer_jobs = [relation.job for relation in EmployerJobRelation.objects.filter(employer__company=self.company_admin.company) if not relation.job.isArchived]
        self.assertEqual(len(response.data), len(employer_jobs))

    def test_company_admin_archived_list_jobs(self):
        '''Test list of archived jobs of an admin.'''
        response = self.client.get(reverse('view-employer-archived-jobs', args=[self.company_admin.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        employer_jobs = [relation.job for relation in EmployerJobRelation.objects.filter(employer__company=self.company_admin.company) if relation.job.isArchived]
        self.assertEqual(len(response.data), len(employer_jobs))

    def test_invalid_company_admin_list_archived_jobs(self):
        '''Test list of jobs of an admin with invalid admin id.'''
        response = self.client.get(reverse('view-admin-archived-jobs', args=[100]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_job_seeker_matched_jobs_listing(self):
        '''Test listing of matched jobs for a job seeker.'''
        job_seeker = JobSeeker.objects.get(pk=1)  # Assuming a JobSeeker with id 1 exists
        response = self.client.get(reverse('job-seeker-matched-jobs', args=[job_seeker.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Assuming getMatchedJobsForJobSeeker is a function that returns matched jobs for a job seeker
        matched_jobs = getMatchedJobsForJobSeeker(job_seeker, Job.objects.filter(isArchived=False))
        self.assertEqual(len(response.data), len(matched_jobs))

    def test_invalid_job_seeker_matched_jobs_listing(self):
        '''Test listing of matched jobs for a job seeker with invalid job seeker id.'''
        response = self.client.get(reverse('job-seeker-matched-jobs', args=[100]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_job_by_job_seeker(self):
        '''Test retrieving a job by a job seeker.'''
        job_seeker = JobSeeker.objects.get(pk=1)
        job = Job.objects.get(pk=1)
        factory = APIRequestFactory()
        request = factory.get(reverse('get_job', args=[job.id]))
        force_authenticate(request,user=job_seeker)
        view = JobRetrieveView.as_view()
        response = view(request,pk=job.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], job.id)

    def test_retrieve_archived_job_by_job_seeker(self):
        '''Test retrieving an archived job by a job seeker.'''
        job_seeker = JobSeeker.objects.get(pk=1)
        job = Job.objects.get(pk=2)
        job.isArchived = True
        job.save()
        factory = APIRequestFactory()
        request = factory.get(reverse('get_job', args=[job.id]))
        force_authenticate(request, user=job_seeker)
        view = JobRetrieveView.as_view()
        response = view(request, pk=job.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_job_by_employer(self):
        '''Test retrieving a job by an employer.'''
        employer = Employer.objects.get(pk=3)
        job = Job.objects.get(pk=1)
        factory = APIRequestFactory()
        request = factory.get(reverse('get_job', args=[job.id]))
        force_authenticate(request, user=employer)
        view = JobRetrieveView.as_view()
        response = view(request, pk=job.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], job.id)
    
    def test_retrieve_job_by_unauthorized_employer(self):
        '''Test retrieving a job by an employer who is not authorized to view the job.'''
        employer = Employer.objects.get(pk=4)  
        job = Job.objects.get(pk=1) 
        factory = APIRequestFactory()
        request = factory.get(reverse('get_job', args=[job.id]))
        force_authenticate(request, user=employer)
        view = JobRetrieveView.as_view()
        response = view(request, pk=job.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_retrieve_job_unauthenticated(self):
        '''Test retrieving a job by an unauthenticated user.'''
        job = Job.objects.get(pk=1)  
        factory = APIRequestFactory()
        request = factory.get(reverse('get_job', args=[job.id]))
        view = JobRetrieveView.as_view()
        response = view(request, pk=job.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_retrieve_nonexistent_job(self):
        '''Test retrieving a job that does not exist.'''
        job_seeker = JobSeeker.objects.get(pk=1)
        factory = APIRequestFactory()
        request = factory.get(reverse('get_job', args=[100]))
        force_authenticate(request, user=job_seeker)
        view = JobRetrieveView.as_view()
        response = view(request, pk=100)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_admin_archived_job_listing(self):
        '''Test retrieving the archived jobs of an admin.'''
        admin = Employer.objects.get(pk=3)
        admin.is_company_admin = True
        admin.save()
        factory = APIRequestFactory()
        request = factory.get(reverse('view-admin-archived-jobs', args=[admin.id]))
        force_authenticate(request, user=admin)
        view = AdminArchivedJobListingView.as_view()
        response = view(request, pk=admin.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        archived_jobs = [relation.job for relation in EmployerJobRelation.objects.filter(employer__company=admin.company) if relation.job.isArchived]
        self.assertEqual(len(response.data), len(archived_jobs))
    
    def test_archive_job(self):
        '''Test archiving a job.'''
        job = Job.objects.get(pk=1) 
        employer = Employer.objects.get(pk=3)
        factory = APIRequestFactory()
        request = factory.put(reverse('update-job-archive', args=[job.id]))
        force_authenticate(request, user=employer)
        view = JobUpdateArchiveView.as_view()
        response = view(request, pk=job.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        job.refresh_from_db()
        self.assertTrue(job.isArchived)