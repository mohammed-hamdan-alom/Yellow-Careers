from django.test import TestCase
from django.core.exceptions import ValidationError
from api.models import Question, Answer

class QuestionModelTestCase(TestCase):

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
        self.question1 = Question.objects.get(pk=1)
        self.question2 = Question.objects.get(pk=2)
        self.question3 = Question.objects.get(pk=3)
        self.question4 = Question.objects.get(pk=4)
    
    def test_valid_question(self):
        self._assert_question_is_valid()
    
    def test_question_cannot_be_blank(self):
        self.question1.question = ''
        self._assert_question_is_invalid()
    
    def test_question_cannot_be_more_than_400_characters(self):
        self.question1.question = 'a'*401
        self._assert_question_is_invalid()
    
    def test_question_can_have_400_characters(self):
        self.question1.question = 'a'*400
        self._assert_question_is_valid()
    
    def test_question_does_not_have_to_be_unique(self):
        self.question3.question = self.question1.question
        self._assert_question_is_valid()
    
    def test_question_must_be_unique_per_job(self):
        self.question2.question = self.question1.question
        self.question2.job = self.question1.job
        self._assert_question_is_invalid()
    
    def test_job_cannot_be_blank(self):
        self.question1.job = None
        self._assert_question_is_invalid()
    
    def test_if_job_is_deleted_question_is_deleted(self):
        self.question1.job.delete()
        with self.assertRaises(Question.DoesNotExist):
            Question.objects.get(pk=self.question1.pk)
    
    def test_if_question_is_deleted_job_is_not_deleted(self):
        self.question1.delete()
        self.assertTrue(self.question1.job)
    
    #Should this be in the answer model tests?
    def test_if_question_is_deleted_answers_are_deleted(self):
        question_id = self.question1.pk
        self.question1.delete()
        with self.assertRaises(Answer.DoesNotExist):
            Answer.objects.get(question=question_id)
        
    def test_if_job_is_deleted_questions_are_deleted(self):
        job_id = self.question1.job.pk
        self.assertTrue(Question.objects.filter(job=job_id).count() > 0)
        self.question1.job.delete()
        with self.assertRaises(Question.DoesNotExist):
            Question.objects.get(job=job_id)   
    
    def _assert_question_is_valid(self):
        self.question1.full_clean()
        self.question2.full_clean()
        self.question3.full_clean()
        self.question4.full_clean()
    
    def _assert_question_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.question3.full_clean()
            self.question4.full_clean()
            self.question1.full_clean()
            self.question2.full_clean()
            

