"""Unit tests for the User model."""
from django.core.exceptions import ValidationError
from django.test import TestCase
from api.models import User
from api.models import JobSeeker
from api.models import Employer
from api.models import EmployerJobRelation
from api.models import Application

class UserModelTestCase(TestCase):

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
        self.user = User.objects.get(email='johndoe@example.com')
        self.user2 = User.objects.get(email='johndoe2@example.com')

        self.jobseeker = JobSeeker.objects.get(user_ptr_id=1)
        self.jobseeker2 = JobSeeker.objects.get(user_ptr_id=2)

        self.applied_job = Application.objects.get(pk=1)
        self.applied_job2 = Application.objects.get(pk=2)
        self.applied_job3 = Application.objects.get(pk=3)

        self.employer = Employer.objects.get(user_ptr_id=3)
        self.employer2 = Employer.objects.get(user_ptr_id=4)

        self.employer_job_relation = EmployerJobRelation.objects.get(pk=1)
        self.employer_job_relation2 = EmployerJobRelation.objects.get(pk=2)
        self.employer_job_relation3 = EmployerJobRelation.objects.get(pk=3)
        

    #the tests below this are for a 'general' user
        
    def test_valid_user(self):
        self._assert_user_is_valid(self.user)

    def test_email_cannot_be_blank(self):
        self.user.email = ''
        self._assert_user_is_invalid(self.user)
    
    def test_email_must_be_unique(self):
        self.user.email = self.user2.email
        self._assert_user_is_invalid(self.user)

    def test_email_cannot_have_an_incorrect_format(self):
        self.user.email = "incorrectformat"
        self._assert_user_is_invalid(self.user)

    def test_email_must_contain_domain(self):
        self.user.email = 'johndoe@example'
        self._assert_user_is_invalid(self.user)
    
    def test_email_must_not_contain_more_than_one_at(self):
        self.user.email = 'johndoe@@example.com'
        self._assert_user_is_invalid(self.user)

    def test_first_name_must_not_be_blank(self):
        self.user.first_name = ''
        self._assert_user_is_invalid(self.user)

    def test_first_name_need_not_be_unique(self):
        self.user.first_name = self.user2.first_name
        self._assert_user_is_valid(self.user)

    def test_first_name_may_contain_50_characters(self):
        self.user.first_name = 'x'*50
        self._assert_user_is_valid(self.user)
    
    def test_first_name_cannot_contain_more_than_50_characters(self):
        self.user.first_name = 'x'*51
        self._assert_user_is_invalid(self.user)
    
    def test_last_name_must_not_be_blank(self):
        self.user.last_name = ''
        self._assert_user_is_invalid(self.user)

    def test_last_name_need_not_be_unique(self):
        self.user.last_name = self.user2.first_name
        self._assert_user_is_valid(self.user)

    def test_last_name_may_contain_50_characters(self):
        self.user.last_name = 'x'*50
        self._assert_user_is_valid(self.user)
    
    def test_last_name_cannot_contain_more_than_50_characters(self):
        self.user.last_name = 'x'*51
        self._assert_user_is_invalid(self.user)

    def test_other_names_can_be_blank(self):
        self.user.other_names = ''
        self._assert_user_is_valid(self.user)

    def test_other_names_need_not_be_unique(self):
        self.user.other_names = self.user2.first_name
        self._assert_user_is_valid(self.user)

    def test_other_names_may_contain_50_characters(self):
        self.user.other_names = 'x'*50
        self._assert_user_is_valid(self.user)
    
    def test_other_names_cannot_contain_more_than_50_characters(self):
        self.user.other_names = 'x'*51
        self._assert_user_is_invalid(self.user)

    def test_valid_phone_number(self):
        self._assert_user_is_valid(self.user)

    def test_phone_number_cannot_be_blank(self):
        self.user.phone_number = ''
        self._assert_user_is_invalid(self.user)
    
    def test_phone_number_cannot_have_letters(self):
        self.user.phone_number = 'adasda213213'
        self._assert_user_is_invalid(self.user)

    def test_phone_number_cannot_be_less_than_9_chars(self):
        self.user.phone_number = '12345678'
        self._assert_user_is_invalid(self.user)

    def test_phone_number_can_be_more_than_8_chars(self):
        self.user.phone_number = '123456789'
        self._assert_user_is_valid(self.user)
    
    def test_phone_number_cannot_be_longer_than_15_chars(self):
        self.user.phone_number = '2'*16
        self._assert_user_is_invalid(self.user)

    #the tests below this are for jobseeker users

    def test_valid_jobseeker(self):
        self._assert_user_is_valid(self.jobseeker)

    def test_sex_choices(self):
        self.jobseeker.sex='this is not one of the choices'
        self._assert_user_is_invalid(self.jobseeker)
    
    def test_dob_cannot_be_blank(self):
        self.jobseeker.dob=''
        self._assert_user_is_invalid(self.jobseeker)
    
    def test_dob_has_to_be_correct_format(self):
        #Django Date field must be in the format YYYY-MM-DD
        self.jobseeker.dob='01-01-1999'
        self._assert_user_is_invalid(self.jobseeker)
        self.jobseeker.dob='1999-01-01'
        self._assert_user_is_valid(self.jobseeker)

    def test_address_has_to_be_address_field(self):
        with self.assertRaises(ValueError):
            self.jobseeker.address = ''
    
    def test_address_cannot_be_null(self):
        self.jobseeker.address = None
        self._assert_user_is_invalid(self.jobseeker)
    
    def test_nationality_can_be_up_to_100_characters(self):
        self.jobseeker.nationality = 'x'*100
        self._assert_user_is_valid(self.jobseeker)
    
    def test_nationality_cannot_be_more_than_100_characters(self):
        self.jobseeker.nationality = 'x'*101
        self._assert_user_is_invalid(self.jobseeker)
    
    def test_nationality_cannot_be_blank(self):
        self.jobseeker.nationality = ''
        self._assert_user_is_invalid(self.jobseeker)
    
    def test_nationality_need_not_be_unique(self):
        self.jobseeker.nationality = self.jobseeker2.nationality
        self._assert_user_is_valid(self.jobseeker)
    
    def test_resume_has_be_resume_instance(self):
        with self.assertRaises(ValueError):
            self.jobseeker.resume = ''

    def test_get_applied_jobs(self):
        applied_jobs = self.jobseeker.get_applied_jobs()
        self.assertIn(self.applied_job,applied_jobs)
        self.assertIn(self.applied_job3,applied_jobs)
        self.assertNotIn(self.applied_job2,applied_jobs) #not originally in jobseeker's applied jobs

        self.applied_job2.job_seeker = self.jobseeker
        self.applied_job2.save()

        applied_jobs2 = self.jobseeker.get_applied_jobs()
        self.assertIn(self.applied_job,applied_jobs2)
        self.assertIn(self.applied_job3,applied_jobs2)
        self.assertIn(self.applied_job2,applied_jobs2)

    #the tests below this are for employer users

    def test_company_for_employer_cannot_be_empty(self):
        self.employer.company = None
        self._assert_user_is_invalid(self.employer)

    def test_company_for_employer_must_be_company_instance(self):
        with self.assertRaises(ValueError):
            self.employer.company=''

    def test_is_company_admin_field_is_boolean(self):
        self.employer.is_company_admin = 'asd'
        self._assert_user_is_invalid(self.employer)    
    
    def test_get_posted_jobs_by_self(self):
        retrieved_posted_jobs = self.employer.get_posted_jobs_by_self()
        self.assertIn(self.employer_job_relation,retrieved_posted_jobs)
        self.assertIn(self.employer_job_relation3,retrieved_posted_jobs)
        self.employer_job_relation2.employer = self.employer
        self.employer_job_relation2.save()
        retrieved_posted_jobs2 = self.employer.get_posted_jobs_by_self()
        self.assertIn(self.employer_job_relation,retrieved_posted_jobs2)
        self.assertIn(self.employer_job_relation2,retrieved_posted_jobs2)
        self.assertIn(self.employer_job_relation3,retrieved_posted_jobs2)

    def test_get_all_posted_jobs_without_admin(self):
        #if employer is not admin, this should be the same as self.get_posted_jobs_by_self()
        self.employer.is_company_admin = False
        self.employer2.company = self.employer.company
        self.employer2.save()
        retrieved_posted_jobs = self.employer.get_all_posted_jobs()
        self.assertIn(self.employer_job_relation,retrieved_posted_jobs)
        self.assertIn(self.employer_job_relation3,retrieved_posted_jobs)
        self.assertNotIn(self.employer_job_relation2,retrieved_posted_jobs)

    def test_get_all_posted_jobs_as_admin(self):
        #should show all jobs that the company the employer is part of has posted        
        self.employer2.company = self.employer.company
        self.employer2.save()
        retrieved_posted_jobs = self.employer.get_all_posted_jobs()
        self.assertIn(self.employer_job_relation,retrieved_posted_jobs)
        self.assertIn(self.employer_job_relation3,retrieved_posted_jobs)
        self.assertIn(self.employer_job_relation2,retrieved_posted_jobs) #this is a job posted by employer2



    def _assert_user_is_valid(self,user):
        try:
            user.full_clean()  
        except (ValidationError):
            self.fail(f"{user}should be valid")

    def _assert_user_is_invalid(self,user):
        with self.assertRaises(ValidationError):
            user.full_clean()

    

