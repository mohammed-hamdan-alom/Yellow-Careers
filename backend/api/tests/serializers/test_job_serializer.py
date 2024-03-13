from django.test import TestCase
from api.models import Job
from api.serializers import JobSerializer

class JobSerializerTestCase(TestCase):

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
        self.serializer = JobSerializer(instance=self.job)
    
    def test_serializer_fields(self):
        serializer = JobSerializer()
        expected_fields = {'id','title','description' ,'address', 'job_type', 'salary'}
        self.assertEqual(set(serializer.fields.keys()), expected_fields)


    def test_serializer_data(self):
        expected_data = {
            'id' : self.job.id,
            'title' : self.job.title,
            'description' : self.job.description,
            'address': self.job.address_id,
            'job_type': self.job.job_type,
            'salary' : self.job.salary,
        }
        self.assertEqual(self.serializer.data, expected_data)

    
    def test_serializer_validation(self):
        # Test validation with empty data
        serializer = JobSerializer(data={})
        self.assertFalse(serializer.is_valid())


        # Test validation with invalid data (missing required fields)
        invalid_data = {
            'title' : 'random',
            'description' : 'random',
            'address': 100, #invalid
            'job_type': 'FT',
            'salary' : '10000',
        }
        serializer = JobSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())

    def test_update(self):
        new_data = {
            'title': 'Senior Software Engineer',
            'description': 'Develop and maintain software, and manage a team',
            'job_type': 'Part Time',
            'salary': 80000,
        }
        updated_job = self.serializer.update(self.job, new_data)
        updated_job.refresh_from_db()

        self.assertEqual(updated_job.title, new_data['title'])
        self.assertEqual(updated_job.description, new_data['description'])
        self.assertEqual(updated_job.job_type, new_data['job_type'])
        self.assertEqual(updated_job.salary, new_data['salary'])