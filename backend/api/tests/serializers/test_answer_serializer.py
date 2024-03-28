from django.test import TestCase
from rest_framework.test import APIClient
from api.models import Answer
from api.serializers import AnswerSerializer

class AnswerSerializerTestCase(TestCase):
    '''Test the AnswerSerializer.'''

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
        self.answer = Answer.objects.get(pk=1)
        self.serializer = AnswerSerializer(instance=self.answer)
    
    def test_serializer_fields(self):
        serializer = AnswerSerializer()
        expected_fields = {'id', 'application','question','answer'}
        self.assertEqual(set(serializer.fields.keys()), expected_fields)


    def test_serializer_data(self):
        expected_data = {
            'id' : self.answer.id,
            'application' : self.answer.application_id,
            'question': self.answer.question_id,
            'answer': self.answer.answer
        }
        self.assertEqual(self.serializer.data, expected_data)

    
    def test_serializer_validation(self):
        serializer = AnswerSerializer(data={})
        self.assertFalse(serializer.is_valid())

        valid_data = {
            'application': 2,
            'question': 2,
            'answer': 'Valid answer text'
        }
        serializer = AnswerSerializer(data=valid_data)
        self.assertTrue(serializer.is_valid())

        invalid_data = {
            'question': 2,
            'answer': 'Invalid answer text'
        }

        serializer = AnswerSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())