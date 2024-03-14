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
                        company = validated_data['company']
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
        jobseeker = JobSeeker.objects.create(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            other_names=validated_data['other_names'],
            dob=validated_data['dob'],
            phone_number=validated_data['phone_number'],
            nationality=validated_data['nationality'],
            sex=validated_data['sex'],
        )
        jobseeker.set_password(validated_data['password'])
        jobseeker.save()
        return jobseeker

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email

        # Determine the user's role and add it to the token payload
        if hasattr(user, 'jobseeker'):
            token['user_type'] = 'job_seeker'
        elif hasattr(user, 'employer'):
            token['user_type'] = 'employer'
        else:
            # Default to job seeker if role cannot be determined
            token['user_type'] = 'job_seeker'

        return token
