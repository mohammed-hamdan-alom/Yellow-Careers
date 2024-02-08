from django.test import TestCase
from django.core.exceptions import ValidationError
from api.models import EmployerJobRelation

class EmployerJobRelationModelTest(TestCase):

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
        self.employer_job_relation1 = EmployerJobRelation.objects.get(pk=1)
        self.employer_job_relation2 = EmployerJobRelation.objects.get(pk=2)
        self.employer_job_relation3 = EmployerJobRelation.objects.get(pk=3)

    def test_valid_employer_job_relation(self):
        self._assert_employer_job_relation_is_valid()
    
    def test_employer_cannot_be_blank(self):
        self.employer_job_relation1.employer = None
        self._assert_employer_job_relation_is_invalid()
    
    def test_job_cannot_be_blank(self):
        self.employer_job_relation1.job = None
        self._assert_employer_job_relation_is_invalid()
    
    def test_employer_and_job_pair_must_be_unique(self):
        self.employer_job_relation2.employer = self.employer_job_relation1.employer
        self.employer_job_relation2.job = self.employer_job_relation1.job
        self._assert_employer_job_relation_is_invalid()
    
    def test_employer_can_have_multiple_jobs(self):
        self.employer_job_relation2.employer = self.employer_job_relation1.employer
        self._assert_employer_job_relation_is_valid()

    def test_job_can_have_multiple_employers(self):
        self.employer_job_relation2.job = self.employer_job_relation1.job
        self._assert_employer_job_relation_is_valid()
    
    def test_if_employer_and_job_relation_is_deleted_employer_is_not_deleted(self):
        self.employer_job_relation1.delete()
        self.assertTrue(self.employer_job_relation1.employer)

    def test_if_employer_and_job_relation_is_deleted_job_is_not_deleted(self):
        self.employer_job_relation1.delete()
        self.assertTrue(self.employer_job_relation1.job)
    
    def test_if_employer_is_deleted_employer_and_job_relation_is_deleted(self):
        self.employer_job_relation1.employer.delete()
        with self.assertRaises(EmployerJobRelation.DoesNotExist):
            EmployerJobRelation.objects.get(pk=self.employer_job_relation1.pk)

    def test_if_job_is_deleted_employer_and_job_relation_is_deleted(self):
        self.employer_job_relation1.job.delete()
        with self.assertRaises(EmployerJobRelation.DoesNotExist):
            EmployerJobRelation.objects.get(pk=self.employer_job_relation1.pk)
    
    def _assert_employer_job_relation_is_valid(self):
        self.employer_job_relation1.full_clean()
        self.employer_job_relation2.full_clean()
        self.employer_job_relation3.full_clean()
    
    def _assert_employer_job_relation_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.employer_job_relation2.full_clean()
            self.employer_job_relation3.full_clean()
            self.employer_job_relation1.full_clean()