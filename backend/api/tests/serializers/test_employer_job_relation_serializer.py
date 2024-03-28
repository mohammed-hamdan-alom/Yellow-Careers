from django.test import TestCase
from api.models import EmployerJobRelation
from api.serializers import EmployerJobRelationSerializer

class EmployerJobRelationSerializerTestCase(TestCase):
    '''Test for EmployerJobRelationSerializer'''

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
        self.employer_job_relation = EmployerJobRelation.objects.get(pk=1)
        self.serializer = EmployerJobRelationSerializer(instance=self.employer_job_relation)
    
    def test_serializer_fields(self):
        serializer = EmployerJobRelationSerializer()
        expected_fields = {'id', 'employer', 'job'}
        self.assertEqual(set(serializer.fields.keys()), expected_fields)


    def test_serializer_data(self):
        expected_data = {
            'id' : self.employer_job_relation.id,
            'employer' : self.employer_job_relation.employer_id,
            'job' : self.employer_job_relation.job_id,
        }
        self.assertEqual(self.serializer.data, expected_data)

    
    def test_serializer_validation(self):
        # Test validation with empty data
        serializer = EmployerJobRelationSerializer(data={})
        self.assertFalse(serializer.is_valid())


        # Test validation with invalid data (missing required fields)
        invalid_data = {
            'employer' : 3,
            #missing job
        }
        serializer = EmployerJobRelationSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())