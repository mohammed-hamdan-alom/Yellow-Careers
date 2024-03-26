from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from api.models import User, Company, JobSeeker
from api.serializers import UserSerializer, MyTokenObtainPairSerializer, EmployerRegisterSerializer, JobSeekerRegisterSerializer, ChangePasswordSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.test import APIRequestFactory


class UserSerializerTest(TestCase):

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
        self.user = User.objects.get(email='johndoe@example.com')
        self.serializer = UserSerializer(instance=self.user)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(data.keys(), ['id', 'email'])

    def test_valid_user_serializer(self):
        self.assertEqual(self.serializer.data['email'], 'johndoe@example.com')

    def test_invalid_user_serializer(self):
        user_data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': '',
            'phone_number': '08012345678',
        }
        invalid_serializer = UserSerializer(data=user_data)
        self.assertFalse(invalid_serializer.is_valid())

    def test_token_with_additional_claims(self):
        
        token_serializer = MyTokenObtainPairSerializer()

        # Generate token with additional claims
        token = token_serializer.get_token(self.user)

        # Ensure the token contains the expected claims
        self.assertEqual(token['email'], self.user.email)

class EmployerRegisterSerializerTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.company = Company.objects.create(company_name="random")
        self.valid_payload = {
            'email': 'test@test.com',
            'password': 'testpassword123',
            'password2': 'testpassword123',
            'first_name': 'John',
            'last_name': 'Doe',
            'other_names': 'random',
            'phone_number': '1234567890',
            'company': self.company.id,
            'is_company_admin': True
        }

    def test_create_employer(self):
        serializer = EmployerRegisterSerializer(data=self.valid_payload)
        if serializer.is_valid():
            employer = serializer.save()
            self.assertIsInstance(employer, User)
            self.assertEqual(employer.email, self.valid_payload['email'])
            self.assertTrue(employer.check_password(self.valid_payload['password']))
    
    def test_passwords_not_match(self):
        self.valid_payload['password2'] = 'wrongpassword'
        serializer = EmployerRegisterSerializer(data=self.valid_payload)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)
        self.assertEqual(serializer.errors['password'][0], 'Password fields do not match')

class JobSeekerRegisterSerializerTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.valid_payload = {
            'email': 'test@test.com',
            'password': 'Testpassword123_',
            'password2': 'Testpassword123_',
            'first_name': 'John',
            'last_name': 'Doe',
            'other_names' : 'random',
            'dob': '1990-01-01',
            'phone_number': '1234567890',
            'nationality': 'Country',
            'sex': 'M'
        }

    def test_create_jobseeker(self):
        serializer = JobSeekerRegisterSerializer(data=self.valid_payload)
        if serializer.is_valid():
            user = serializer.save()
            self.assertIsInstance(user, User)
            self.assertEqual(user.email, self.valid_payload['email'])
            self.assertTrue(user.check_password(self.valid_payload['password']))

    def test_passwords_not_match(self):
        self.valid_payload['password2'] = 'wrongpassword'
        serializer = JobSeekerRegisterSerializer(data=self.valid_payload)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(serializer.errors['password'][0], 'Password fields do not match')

    def test_update_jobseeker_password_match(self):
        jobseeker = JobSeeker.objects.create(
            email='test@test.com',
            first_name='John',
            last_name='Doe',
            other_names='random',
            dob='1990-01-01',
            phone_number='1234567890',
            nationality='Country',
            sex='M'
        )
        update_payload = {
            'email': jobseeker.email,
            'first_name': jobseeker.first_name,
            'last_name': jobseeker.last_name,
            'dob': jobseeker.dob,
            'phone_number': jobseeker.phone_number,
            'nationality': jobseeker.nationality,
            'sex': jobseeker.sex,
            'password': 'NewTestpassword123_',
            'password2': 'NewTestpassword123_'
        }

        serializer = JobSeekerRegisterSerializer(instance=jobseeker, data=update_payload)
        self.assertTrue(serializer.is_valid())
        if serializer.is_valid():
            updated_jobseeker = serializer.save()
            self.assertTrue(updated_jobseeker.check_password(update_payload['password']))


    def test_update_jobseeker_password_not_match(self):
        jobseeker = JobSeeker.objects.create(
            email='test@test.com',
            first_name='John',
            last_name='Doe',
            other_names='random',
            dob='1990-01-01',
            phone_number='1234567890',
            nationality='Country',
            sex='M'
        )
        # Create a payload for update with mismatching passwords
        update_payload = {
            'email': jobseeker.email,
            'first_name': jobseeker.first_name,
            'last_name': jobseeker.last_name,
            'dob': jobseeker.dob,
            'phone_number': jobseeker.phone_number,
            'nationality': jobseeker.nationality,
            'sex': jobseeker.sex,
            'password': 'NewTestpassword123_',
            'password2': 'MismatchedPassword123_'
    }
        serializer = JobSeekerRegisterSerializer(instance=jobseeker, data=update_payload)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(serializer.errors['password'][0], 'Password fields do not match')

class ChangePasswordSerializerTestCase(TestCase):

    def setUp(self):
        self.test_user = User.objects.create_user(email='johndoe5@example.com', password='Password123_')
        request_factory = APIRequestFactory()
        self.request = request_factory.get('employer/change-password/')
        self.request.user = self.test_user

    def test_valid_data(self):
        data = {
            'old_password': 'Password123_',
            'new_password': 'NewPassword123!',
            'confirm_password': 'NewPassword123!'
        }
        serializer = ChangePasswordSerializer(data=data, context={'request' : self.request})
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data, data)

    def test_password_mismatch(self):
        data = {
            'old_password': 'Password123_',
            'new_password': 'NewPassword123!',
            'confirm_password': 'DifferentPassword123!'
        }
        serializer = ChangePasswordSerializer(data=data, context={'request' : self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)
        self.assertEqual(serializer.errors['non_field_errors'][0], "New password and confirm password must match")
    
    def test_old_password_is_incorrect(self):
        data = {
            'old_password': 'WrongOldPassword123_',
            'new_password': 'NewPassword123!',
            'confirm_password': 'NewPassword123!'
        }
        serializer = ChangePasswordSerializer(data=data, context={'request' : self.request})
        self.assertFalse(serializer.is_valid())
        self.assertIn('old_password', serializer.errors)
        self.assertEqual(serializer.errors['old_password'][0], "Incorrect old password")
    
    def test_weak_password_validation(self):
        data = {
            'old_password': 'oldPassword123!',
            'new_password': 'password123',
            'confirm_password': 'password123'
        }
        serializer = ChangePasswordSerializer(data=data, context={'request':self.request})
        with self.assertRaises(ValidationError) as context:
            serializer.is_valid(raise_exception=True)

        self.assertEqual(context.exception.detail['new_password'][0], "This password is too common.")