from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import User

class ChangePasswordViewTestCase(APITestCase):
    '''Test module for changing password of a user.'''
    
    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', password='oldPassword123!')
        self.client.force_authenticate(user=self.user)

    def test_change_password_success(self):
        url = reverse('job-seeker-change-password')  # Assuming 'change-password' is the URL name for the ChangePasswordView
        data = {
            'old_password': 'oldPassword123!',
            'new_password': 'NewPassword123!',
            'confirm_password': 'NewPassword123!'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'message': 'Password changed successfully.'})

    def test_change_password_wrong_old_password(self):
        url = reverse('job-seeker-change-password')
        data = {
            'old_password': 'wrongPassword123!',
            'new_password': 'NewPassword123!',
            'confirm_password': 'NewPassword123!'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'old_password': ['Wrong password.']})

    def test_change_password_mismatch(self):
        url = reverse('job-seeker-change-password')
        data = {
            'old_password': 'oldPassword123!',
            'new_password': 'NewPassword123!',
            'confirm_password': 'DifferentPassword123!'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data,{'non_field_errors' : ['New password and confirm password do not match.']})
