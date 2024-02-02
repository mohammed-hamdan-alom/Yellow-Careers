from django.test import TestCase
from django.core.exceptions import ValidationError
from api.models import JobSeeker

class UserTestCase(TestCase):
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
        self.jobseeker = JobSeeker.objects.get(pk=1)
    
    def test_valid_jobseeker(self):
        self._assert_jobseeker_is_valid()

    def _assert_jobseeker_is_valid(self):
        try:
            self.jobseeker.full_clean()
        except ValidationError as e:
            self.fail(f'JobSeeker model should be valid, but got ValidationError: {e}')

