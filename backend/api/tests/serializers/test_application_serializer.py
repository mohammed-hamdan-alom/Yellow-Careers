from django.test import TestCase
from api.models import Application
from api.serializers import ApplicationSerializer

class ApplicationSerializerTestCase(TestCase):

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
        self.application = Application.objects.get(pk=1)
        self.serializer = ApplicationSerializer(instance=self.application)
    
    def test_serializer_fields(self):
        serializer = ApplicationSerializer()
        expected_fields = {'id', 'job_seeker','resume','job', 'date_applied','status','decision'}
        self.assertEqual(set(serializer.fields.keys()), expected_fields)


    def test_serializer_data(self):
        expected_data = {
            'id' : self.application.id,
            'job_seeker' : self.application.job_seeker_id,
            'resume': self.application.resume_id,
            'job': self.application.job_id,
            'date_applied': str(self.application.date_applied)
        }
        self.assertEqual(self.serializer.data, expected_data)

    
    def test_serializer_validation(self):
        # Test validation with empty data
        serializer = ApplicationSerializer(data={})
        self.assertFalse(serializer.is_valid())


        # Test validation with invalid data (missing required fields)
        invalid_data = {
            'resume': 2,
            'job': 3,
            'date_applied': '2024-01-01'
        }
        serializer = ApplicationSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())