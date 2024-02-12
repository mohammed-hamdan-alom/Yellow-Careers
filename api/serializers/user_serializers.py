from api.models import User, Employer, JobSeeker
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']

class EmployerRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Employer
        fields = ['email', 'password', 'password2', 'company']
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields do not match"})
        return attrs

    def create(self, validated_data):
        user = Employer.objects.create(
			email=validated_data['email'],
			company = validated_data['company']  # Set the company separately
		)
        user.set_password(validated_data['password'])
        user.save()
        return user

class JobSeekerRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = JobSeeker
        fields = ['email', 'password', 'password2', 'first_name', 'last_name', 'other_names', 'dob', 'phone_number', 'nationality', 'sex'] 

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields do not match"})
        return attrs

    def create(self, validated_data):
        user = JobSeeker.objects.create(
            email=validated_data['email'],
            dob=validated_data['dob'],
            nationality=validated_data['nationality'],
			
            sex=validated_data['sex'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['phone_number'] = user.phone_number
        return token
