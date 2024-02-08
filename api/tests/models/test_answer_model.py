from django.test import TestCase
from django.core.exceptions import ValidationError
from api.models import Answer

class AnswerModelTestCase(TestCase):
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
        self.answer1 = Answer.objects.get(pk=1)
        self.answer2 = Answer.objects.get(pk=2)
        self.answer3 = Answer.objects.get(pk=3)
        self.answer4 = Answer.objects.get(pk=4)
    
    def test_valid_answer(self):
        self._assert_answer_is_valid()
    
    def test_question_cannot_be_null(self):
        self.answer1.question = None
        self._assert_answer_is_invalid()
    
    def test_application_cannot_be_null(self):
        self.answer1.application = None
        self._assert_answer_is_invalid()
    
    # Can it be blank or not?
    def test_answer_cannot_be_blank(self):
        self.answer1.answer = ''
        self._assert_answer_is_invalid()
    
    def test_answer_cannot_be_null(self):
        self.answer1.answer = None
        self._assert_answer_is_invalid()
    
    def test_answer_cannot_be_more_than_2000_characters(self):
        self.answer1.answer = 'a' * 2001
        self._assert_answer_is_invalid()
    
    def test_answer_can_be_2000_characters(self):
        self.answer1.answer = 'a' * 2000
        self._assert_answer_is_valid()
    
    def test_application_and_question_combination_must_be_unique(self):
        answer = Answer(application=self.answer1.application, question=self.answer1.question, answer='This is a test answer')
        with self.assertRaises(ValidationError):
            answer.full_clean()

    def _assert_answer_is_valid(self):
        self.answer1.full_clean()
        self.answer2.full_clean()
        self.answer3.full_clean()
        self.answer4.full_clean()
    
    def _assert_answer_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.answer1.full_clean()
            self.answer2.full_clean()
            self.answer3.full_clean()
            self.answer4.full_clean()
