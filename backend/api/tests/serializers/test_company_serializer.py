from django.test import TestCase
from api.models import Company
from api.serializers import CompanySerializer

class CompanySerializerTestCase(TestCase):
    '''Tests for the CompanySerializer class in the CompanySerializer module.'''

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
        self.company = Company.objects.get(pk=1)
        self.serializer = CompanySerializer(instance=self.company)
    
    def test_serializer_fields(self):
        serializer = CompanySerializer()
        expected_fields = {'id', 'about', 'company_name','website'}
        self.assertEqual(set(serializer.fields.keys()), expected_fields)


    def test_serializer_data(self):
        expected_data = {
            'id' : self.company.id,
            'about' : self.company.about,
            'company_name' : self.company.company_name,
            'website': self.company.website,
        }
        self.assertEqual(self.serializer.data, expected_data)

    
    def test_serializer_validation(self):
        # Test validation with empty data
        serializer = CompanySerializer(data={})
        self.assertFalse(serializer.is_valid())


        # Test validation with invalid data (missing required fields)
        invalid_data = {
            'not_a_valid_field': 'random'
        }
        serializer = CompanySerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())