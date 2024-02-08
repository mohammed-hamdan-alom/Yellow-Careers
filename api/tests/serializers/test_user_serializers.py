from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from api.models import User
from api.serializers import UserSerializer, MyTokenObtainPairSerializer, RegisterSerializer

class UserSerializerTest(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email='test@test.com',
        )
        self.serializer = UserSerializer(instance=self.user)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(data.keys(), ['id', 'email'])

class MyTokenObtainPairSerializerTest(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email='test@test.com',
            first_name='Test',
            last_name='User',
            phone_number='+12345678901'
        )
        self.serializer = MyTokenObtainPairSerializer(data={'email': 'test@test.com'})

    def test_contains_expected_fields(self):
        self.serializer.is_valid()
        token = self.serializer.validated_data
        self.assertIn('email', token)
        self.assertIn('first_name', token)
        self.assertIn('last_name', token)
        self.assertIn('phone_number', token)

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