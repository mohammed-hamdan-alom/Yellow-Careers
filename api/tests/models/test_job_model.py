from django.test import TestCase
from django.core.exceptions import ValidationError
from api.models import Job, Application, EmployerJobRelation

class JobModelTestCase(TestCase):

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
        self.job = Job.objects.get(pk=1)
        self.job2 = Job.objects.get(pk=2)
        self.job3 = Job.objects.get(pk=3)
    
    def test_valid_job(self):
        self._assert_job_is_valid()
    
    def test_title_cannot_be_blank(self):
        self.job.title = ''
        self._assert_job_is_invalid()
    
    def test_description_cannot_be_blank(self):
        self.job.description = ''
        self._assert_job_is_invalid()
    
    def test_job_type_cannot_be_blank(self):
        self.job.job_type = ''
        self._assert_job_is_invalid()
    
    def test_title_cannot_be_null(self):
        self.job.title = None
        self._assert_job_is_invalid()
    
    def test_description_cannot_be_null(self):
        self.job.description = None
        self._assert_job_is_invalid()
    
    def test_job_type_cannot_be_null(self):
        self.job.job_type = None
        self._assert_job_is_invalid()
    
    def test_title_cannot_be_longer_than_50_characters(self):
        self.job.title = 'a' * 51
        self._assert_job_is_invalid()
    
    def test_description_cannot_be_longer_than_1000_characters(self):
        self.job.description = 'a' * 1001
        self._assert_job_is_invalid()

    def test_salary_cannot_be_negative(self):
        self.job.salary = -1
        self._assert_job_is_invalid()
    
    def test_salary_can_be_zero(self):
        self.job.salary = 0
        self._assert_job_is_valid()
    
    def test_salary_can_be_null(self):
        self.job.salary = None
        self._assert_job_is_valid()
    
    def test_address_can_be_null(self):
        self.job.address = None
        self._assert_job_is_valid()
    
    def test_title_can_contain_special_characters(self):
        self.job.title = 'a@'
        self._assert_job_is_valid()
    
    def test_job_type_cannot_contain_special_characters(self):
        self.job.job_type = 'a@'
        self._assert_job_is_invalid()
    
    def test_title_can_contain_numbers(self):
        self.job.title = 'a1'
        self._assert_job_is_valid()
    
    def test_job_type_cannot_contain_numbers(self):
        self.job.job_type = 'a1'
        self._assert_job_is_invalid()
    
    def test_title_can_contain_spaces(self):
        self.job.title = 'a '
        self._assert_job_is_valid()
    
    def test_get_applications_method(self):
        self.assertEqual(self.job.get_applications().count(), Application.objects.filter(job_id=self.job.id).count())

    def test_get_employers_ids_method(self):
        self.assertEqual(self.job.get_employers_ids().count(), EmployerJobRelation.objects.filter(job_id=self.job.id).values_list('employer_id', flat=True).count())
    
    def _assert_job_is_valid(self):
        self.job.full_clean()
        self.job2.full_clean()
        self.job3.full_clean()

    def _assert_job_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.job2.full_clean()
            self.job3.full_clean()
            self.job.full_clean()

