from django.test import TestCase
from api.models import User
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _


class UserModelTestCase(TestCase):
    '''Test case for the User model'''

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


    def test_create_superuser_with_is_superuser_false(self):
        User = get_user_model()
        with self.assertRaises(ValueError) as context:
            User.objects.create_superuser(
                email='admin@example.com',
                password='password',
                is_superuser=False
            )
        
        expected_error_message = str(_("Superuser must have is_superuser=True."))
        self.assertTrue(
            expected_error_message in str(context.exception),
            "Expected ValueError with specific message"
        )