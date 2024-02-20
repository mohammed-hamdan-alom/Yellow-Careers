from django.test import TestCase
from api.models import Employer
from api.serializers import EmployerSerializer

class EmployerSerializerTestCase(TestCase):

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
        self.employer = Employer.objects.get(user_ptr_id=3)
        self.serializer = EmployerSerializer(instance=self.employer)
    
    def test_serializer_fields(self):
        serializer = EmployerSerializer()
        expected_fields = {'id','first_name','last_name' ,'phone_number', 'email', 'other_names', 'company', 'is_company_admin'}
        self.assertEqual(set(serializer.fields.keys()), expected_fields)


    def test_serializer_data(self):
        expected_data = {
            'id' : self.employer.id,
            'first_name' : self.employer.first_name,
            'last_name' : self.employer.last_name,
            'other_names': self.employer.other_names,
            'phone_number': self.employer.phone_number,
            'email' : self.employer.email,
            'company' : self.employer.company_id,
            'is_company_admin' : self.employer.is_company_admin
        }
        self.assertEqual(self.serializer.data, expected_data)

    
    def test_serializer_validation(self):
        # Test validation with empty data
        serializer = EmployerSerializer(data={})
        self.assertFalse(serializer.is_valid())


        # Test validation with invalid data (missing required fields)
        invalid_data = {
            'company' : 1,
            'first_name': 'random',
            'last_name' :'random',
        }
        serializer = EmployerSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())