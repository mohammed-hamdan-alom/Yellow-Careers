from django.test import TestCase
from api.models import Answer, Application, Question
from django.urls import reverse
from rest_framework import status

class AnswerViewTestCase(TestCase):

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
        self.answers = [Answer.objects.get(pk=1), 
                        Answer.objects.get(pk=2), 
                        Answer.objects.get(pk=3),
                        Answer.objects.get(pk=4),]
    
    def test_list_answers(self):
        response = self.client.get(reverse('answer-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.answers))
    
    def test_create_answer(self):
        answer_data = {
            'question' : 1,
            'answer' : 'I am a very good problem solver',
            'application' : 2,
        }
        response = self.client.post(reverse('answer-post'), answer_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Answer.objects.count(), len(self.answers) + 1)
    
    def test_update_answer(self):
        answer = self.answers[0]
        updated_answer_data = {
            'question' : 2,
            'answer' : 'Changed answer',
            'application' : 2,
        }
        response = self.client.put(reverse('answer-put', args=[answer.id]), updated_answer_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        answer.refresh_from_db()
        self.assertEqual(answer.question.id, updated_answer_data['question'])
        self.assertEqual(answer.answer, updated_answer_data['answer'])
        self.assertEqual(answer.application.id, updated_answer_data['application']) 
    
    def test_delete_answer(self):
        answer = self.answers[0]
        response = self.client.delete(reverse('answer-put', args=[answer.id]), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Answer.objects.count(), len(self.answers) - 1)
    
    def test_invalid_update_answer(self):
        answer = self.answers[0]
        updated_answer_data = {
            'question' : 2,
            'answer' : 'k'*2001,
            'application' : 2,
        }
        response = self.client.put(reverse('answer-put', args=[answer.id]), updated_answer_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        answer.refresh_from_db()
        self.assertNotEqual(answer.question.id, updated_answer_data['question'])
        self.assertNotEqual(answer.answer, updated_answer_data['answer'])
        self.assertNotEqual(answer.application.id, updated_answer_data['application'])

    
    def test_create_invalid_answer(self):
        answer_data = {
            'question' : 1,
            'answer' : 'k'*2001,
            'application' : 2,
        }
        response = self.client.post(reverse('answer-post'), answer_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Answer.objects.count(), len(self.answers))
    
    def test_delete_invalid_answer(self):
        response = self.client.delete(reverse('answer-put', args=[100]), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Answer.objects.count(), len(self.answers))

    def test_list_application_answers(self):
        '''Test that the endpoint returns a list of all the answers of a given application.'''
        application = Application.objects.get(pk=1)
        job = application.job
        questions = Question.objects.filter(job=job)
        question_ids = [question.id for question in questions]
        answers = Answer.objects.filter(question__in=question_ids, application=application)
        response = self.client.get(reverse('application-answer-list', args=[application.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(answers))

    def test_invalid_list_application_answers(self):
        '''Test that the endpoint returns a 404 status code when the application does not exist.'''
        response = self.client.get(reverse('application-answer-list', args=[100]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {'detail': 'Not found.'})