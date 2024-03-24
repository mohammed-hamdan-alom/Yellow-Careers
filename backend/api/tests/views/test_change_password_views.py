from django.contrib.auth import get_user_model
from django.urls import reverse
from api.views import ChangePasswordView
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from api.models.user import *

class ChangePasswordViewTestCase(APITestCase):
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
        self.user = JobSeeker.objects.get(pk=1)
        self.serializer = ChangePasswordView(instance=self.user)
        print(self.user.password)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)


    def test_change_password_success(self):
        url = reverse('job-seeker-change-password')  # Update with your URL name
        data = {
            'old_password': self.user.password,
            'new_password': 'NewPassword123!',
            'confirm_password': 'NewPassword123!'
        }
        response = self.client.put(url, data)
        print(response.data)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)
        # self.assertEqual(response.data, {'message': 'Password changed successfully.'})

    # def test_change_password_failure(self):
    #     url = reverse('job-seeker-change-password')  # Update with your URL name
    #     data = {
    #         'old_password': 'IncorrectOldPassword',
    #         'new_password': 'NewPassword123!',
    #         'confirm_password': 'NewPassword123!'
    #     }
    #     response = self.client.put(url, data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    #     self.assertIn('old_password', response.data)
