from django.test import TestCase
from django.core.exceptions import ValidationError
from api.models import SavedJobs

class SavedJobsModelTest(TestCase):
    '''Test case for the SavedJobs model'''

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
        self.saved_jobs1 = SavedJobs.objects.get(pk=1)
        self.saved_jobs2 = SavedJobs.objects.get(pk=2)
        self.saved_jobs3 = SavedJobs.objects.get(pk=3)

    def test_valid_saved_jobs(self):
        self._assert_saved_jobs_is_valid()
    
    def test_job_seeker_cannot_be_blank(self):
        self.saved_jobs1.job_seeker = None
        self._assert_saved_jobs_is_invalid()
    
    def test_job_cannot_be_blank(self):
        self.saved_jobs1.job = None
        self._assert_saved_jobs_is_invalid()
    
    def test_job_seeker_and_job_pair_must_be_unique(self):
        self.saved_jobs2.job_seeker = self.saved_jobs1.job_seeker
        self.saved_jobs2.job = self.saved_jobs1.job
        self._assert_saved_jobs_is_invalid()
    
    def test_job_seeker_can_have_multiple_jobs(self):
        self.saved_jobs2.job_seeker = self.saved_jobs1.job_seeker
        self._assert_saved_jobs_is_valid()

    def test_job_can_have_multiple_job_seekers(self):
        self.saved_jobs2.job = self.saved_jobs3.job
        self._assert_saved_jobs_is_valid()
    
    def test_if_job_seeker_and_job_relation_is_deleted_job_seeker_is_not_deleted(self):
        self.saved_jobs1.delete()
        self.assertTrue(self.saved_jobs1.job_seeker)

    def test_if_job_seeker_and_job_relation_is_deleted_job_is_not_deleted(self):
        self.saved_jobs1.delete()
        self.assertTrue(self.saved_jobs1.job)
    
    def test_if_job_seeker_is_deleted_job_seeker_and_job_relation_is_deleted(self):
        self.saved_jobs1.job_seeker.delete()
        with self.assertRaises(SavedJobs.DoesNotExist):
            SavedJobs.objects.get(pk=self.saved_jobs1.pk)

    def test_if_job_is_deleted_job_seeker_and_job_relation_is_deleted(self):
        self.saved_jobs1.job.delete()
        with self.assertRaises(SavedJobs.DoesNotExist):
            SavedJobs.objects.get(pk=self.saved_jobs1.pk)
    
    def _assert_saved_jobs_is_valid(self):
        self.saved_jobs1.full_clean()
        self.saved_jobs2.full_clean()
        self.saved_jobs3.full_clean()
    
    def _assert_saved_jobs_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.saved_jobs2.full_clean()
            self.saved_jobs3.full_clean()
            self.saved_jobs1.full_clean()