from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIRequestFactory
from api.models import InvitedEmployer
from api.views import InvitedEmployerRetrieveByEmailView
from api.views.invited_employer_views import InvitedEmployerCreateView, InvitedEmployerDeleteByEmailView
from unittest.mock import patch


class InvitedEmployerRetrieveByEmailViewTestCase(TestCase):
    '''Test case for the InvitedEmployerRetrieveByEmailView.'''
     
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
     
    def test_retrieve_invited_employer_by_email(self):
        '''Test retrieving an invited employer by email.'''
        # Create an InvitedEmployer instance for testing
        invited_employer = InvitedEmployer.objects.create(email='test@example.com',company_id=1,code='testcode')

        factory = APIRequestFactory()
        request = factory.get(reverse('invited-employer-get'), {'email': invited_employer.email})
        view = InvitedEmployerRetrieveByEmailView.as_view()
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], invited_employer.email)

    def test_retrieve_invited_employer_by_nonexistent_email(self):
        '''Test retrieving an invited employer by a nonexistent email.'''
        non_existent_email = 'nonexistent@example.com'
        factory = APIRequestFactory()
        request = factory.get(reverse('invited-employer-get'), {'email': non_existent_email})
        view = InvitedEmployerRetrieveByEmailView.as_view()
        response = view(request)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_retrieve_invited_employer_without_email(self):
        '''Test retrieving an invited employer without providing an email.'''
        factory = APIRequestFactory()
        request = factory.get(reverse('invited-employer-get'))
        view = InvitedEmployerRetrieveByEmailView.as_view()
        response = view(request)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Email parameter is required')

    def test_delete_invited_employer_by_email(self):
        '''Test deleting an invited employer by email.'''
        # Create an InvitedEmployer instance for testing
        invited_employer = InvitedEmployer.objects.create(email='test@example.com', company_id=1, code='testcode')
        factory = APIRequestFactory()
        url = reverse('invited-employer-delete') + f'?email={invited_employer.email}'
        request = factory.delete(url)
        view = InvitedEmployerDeleteByEmailView.as_view()
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'InvitedEmployer deleted successfully')

    def test_delete_invited_employer_by_nonexistent_email(self):
        '''Test deleting an invited employer by a nonexistent email.'''
        non_existent_email = 'nonexistant@example.com'
        factory = APIRequestFactory()
        url = reverse('invited-employer-delete') + f'?email={non_existent_email}'
        request = factory.delete(url)
        view = InvitedEmployerDeleteByEmailView.as_view()
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'InvitedEmployer with this email does not exist')

    def test_delete_invited_employer_without_email(self):
        '''Test deleting an invited employer without providing an email.'''
        factory = APIRequestFactory()
        request = factory.delete(reverse('invited-employer-delete'))
        view = InvitedEmployerDeleteByEmailView.as_view()
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Email parameter is required')
    
    @patch('api.views.invited_employer_views.send_employer_invitation_email')
    def test_perform_create(self, mock_send_email):
        '''Test the perform_create method.'''
        factory = APIRequestFactory()
        data = {'email': 'test123@example.com', 'company': 1}
        request = factory.post(reverse('invited-employer-create'), data=data)
        view = InvitedEmployerCreateView.as_view()
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_send_email.assert_called_once()