from django.test import TestCase
from api.models import Question
from api.serializers import QuestionSerializer

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
        self.question = Question.objects.get(pk=1)
        self.serializer = QuestionSerializer(instance=self.question)
    
    def test_serializer_fields(self):
        serializer = QuestionSerializer()
        expected_fields = {'id','question','job'}
        self.assertEqual(set(serializer.fields.keys()), expected_fields)


    def test_serializer_data(self):
        expected_data = {
            'id' : self.question.id,
            'question' : self.question.question,
            'job' : self.question.job_id,
        }
        self.assertEqual(self.serializer.data, expected_data)

    
    def test_serializer_validation(self):
        # Test validation with empty data
        serializer = QuestionSerializer(data={})
        self.assertFalse(serializer.is_valid())


        # Test validation with invalid data (missing required fields)
        invalid_data = {
            'question': 'what is your preferred location',
            #missing job
        }
        serializer = QuestionSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())