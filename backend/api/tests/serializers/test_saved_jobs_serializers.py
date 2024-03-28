from django.test import TestCase
from api.models import SavedJobs
from api.serializers import SavedJobsSerializer

class SavedJobsSerializerTest(TestCase):
    '''Test the SavedJobsSerializer.'''

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
        self.saved_jobs = SavedJobs.objects.get(pk=1)
        self.serializer = SavedJobsSerializer(instance=self.saved_jobs)

    def test_model_fields(self):
        fields = SavedJobsSerializer().fields
        self.assertTrue(fields['id'].source == 'id' and fields['id'].read_only is True)
        self.assertEqual(fields['job_seeker'].__class__.__name__, 'PrimaryKeyRelatedField')
        self.assertEqual(fields['job_seeker'].queryset.model.__name__, 'JobSeeker')
        self.assertEqual(fields['job'].__class__.__name__, 'PrimaryKeyRelatedField')
        self.assertEqual(fields['job'].queryset.model.__name__, 'Job')

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertEqual(set(data.keys()), set(['id', 'job_seeker', 'job']))

    def test_id_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['id'], self.saved_jobs.id)

    def test_job_seeker_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['job_seeker'], self.saved_jobs.job_seeker.id)

    def test_job_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['job'], self.saved_jobs.job.id)

    def test_job_seeker_cannot_save_a_job_twice(self):
        serializer = SavedJobsSerializer(data={'job_seeker': 1, 'job': 1})
        self.assertFalse(serializer.is_valid())
        self.assertEqual(set(serializer.errors.keys()), set(['non_field_errors']))

    def test_job_seeker_can_save_a_job(self):
        serializer = SavedJobsSerializer(data={'job_seeker': 1, 'job': 3})
        self.assertTrue(serializer.is_valid())

    def test_data_needs_a_job_seeker(self):
        serializer = SavedJobsSerializer(data={'job': 1})
        self.assertFalse(serializer.is_valid())
        self.assertEqual(set(serializer.errors.keys()), set(['job_seeker']))

    def test_data_needs_a_job(self):
        serializer = SavedJobsSerializer(data={'job_seeker': 1})
        self.assertFalse(serializer.is_valid())
        self.assertEqual(set(serializer.errors.keys()), set(['job']))