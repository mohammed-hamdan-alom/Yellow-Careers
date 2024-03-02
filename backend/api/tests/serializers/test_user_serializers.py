from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from api.models import User
from api.serializers import UserSerializer, MyTokenObtainPairSerializer, RegisterSerializer

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
        self.assertEqual(token['first_name'], self.user.first_name)
        self.assertEqual(token['last_name'], self.user.last_name)
        self.assertEqual(token['phone_number'], self.user.phone_number)


# class MyTokenObtainPairSerializerTest(TestCase):
#     def setUp(self):
#         self.user = User.objects.get(email='johndoe@example.com')
#         self.serializer2 = MyTokenObtainPairSerializer(data={'email': 'test@test.com'})

#     def test_contains_expected_fields(self):
#         self.serializer2.is_valid()
#         token = self.serializer2.validated_data
#         self.assertIn('email', token)
#         self.assertIn('first_name', token)
#         self.assertIn('last_name', token)
#         self.assertIn('phone_number', token)

class RegisterSerializerTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.valid_payload = {
            'email': 'test@test.com',
            'password': 'testpassword123',
            'password2': 'testpassword123',
        }

    def test_create_user(self):
        serializer = RegisterSerializer(data=self.valid_payload)
        if serializer.is_valid():
            user = serializer.save()
            self.assertIsInstance(user, User)
            self.assertEqual(user.email, self.valid_payload['email'])
            self.assertTrue(user.check_password(self.valid_payload['password']))

    def test_passwords_not_match(self):
        self.valid_payload['password2'] = 'wrongpassword'
        serializer = RegisterSerializer(data=self.valid_payload)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(serializer.errors['password'][0], 'Password fields do not match')