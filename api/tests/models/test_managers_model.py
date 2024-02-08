"""Unit tests for the Managers model."""
from django.core.exceptions import ValidationError
from django.test import TestCase
from api.models import User
from api.models import JobSeeker
from api.models import Employer
from api.models import EmployerJobRelation
from api.models import Application

class UserModelTestCase(TestCase):

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

    def test_create_user(self):
        with self.assertRaises(ValueError):
            User.objects.create_user('', 'Password123')
        
        new_user = User.objects.create_user('123@123.com','Password123')
        self.assertEqual(new_user.email, '123@123.com')
        self.assertTrue(new_user.check_password('Password123'))

    def test_create_super_user(self):
        superuser = User.objects.create_superuser('admin@example.com','Admin_password123')
        self.assertEqual(superuser.email, 'admin@example.com')
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)
        self.assertTrue(superuser.is_active)
        with self.assertRaises(ValueError):
            User.objects.create_superuser('admin2@example.com', 'Admin_password123', is_staff=False, is_superuser=False)




    def _assert_user_is_valid(self,user):
        try:
            user.full_clean()  
        except (ValidationError):
            self.fail(f"{user}should be valid")

    def _assert_user_is_invalid(self,user):
        with self.assertRaises(ValidationError):
            user.full_clean()