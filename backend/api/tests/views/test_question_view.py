from django.test import TestCase
from api.models import Question, Job
from django.urls import reverse
from rest_framework import status

class QuestionViewTestCase(TestCase):

    # fixtures = ['api/tests/fixtures/addresses.json']

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
        self.questions = [Question.objects.get(pk=1), 
                          Question.objects.get(pk=2), 
                          Question.objects.get(pk=3),
                          Question.objects.get(pk=4)]
    
    def test_list_questions(self):
        response = self.client.get(reverse('question-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.questions))
    
    def test_retrieve_question(self):
        question = self.questions[0]
        response = self.client.get(reverse('question-get', args=[question.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['question'], question.question)
        self.assertEqual(response.data['job'], question.job.id)
    
    def test_create_question(self):
        question_data = {
            'question' : 'What is your favourite colour?',
            'job' : 1
        }
        response = self.client.post(reverse('question-post'), question_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Question.objects.count(), len(self.questions) + 1)

    def test_update_question(self):
        question = self.questions[0]
        updated_question_data = {
            'question' : 'What is your favourite animal?',
            'job' : 1
        }
        response = self.client.put(reverse('question-put', args=[question.id]), updated_question_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        question.refresh_from_db()
        self.assertEqual(question.question, updated_question_data['question'])
        self.assertEqual(question.job.id, updated_question_data['job'])
        self.assertEqual(Question.objects.count(), len(self.questions))
    
    def test_delete_question(self):
        question = self.questions[0]
        response = self.client.delete(reverse('question-put', args=[question.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Question.objects.count(), len(self.questions) - 1)
    
    def test_invalid_create_question(self):
        question_data = {
            'question' : 'What is your favourite colour?',
            'job' : 100
        }
        response = self.client.post(reverse('question-post'), question_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Question.objects.count(), len(self.questions))
    
    def test_invalid_update_question(self):
        question = self.questions[0]
        updated_question_data = {
            'question' : 'k'*1000,
            'job' : 1
        }
        response = self.client.put(reverse('question-put', args=[question.id]), updated_question_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Question.objects.count(), len(self.questions))
    
    def test_invalid_delete_question(self):
        response = self.client.delete(reverse('question-put', args=[100]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Question.objects.count(), len(self.questions))

    def test_questions_for_a_job(self):
        job = Job.objects.get(pk=1)
        response = self.client.get(reverse('job-question-list', args=[job.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        response_questions = set(data['question'] for data in response.data)
        questions = set(question.question for question in self.questions if question.job == job)
        self.assertEqual(response_questions, questions)