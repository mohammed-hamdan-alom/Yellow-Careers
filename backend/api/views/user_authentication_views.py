from django.shortcuts import render

from api.models import User, Employer, JobSeeker
from api.serializers import UserSerializer, MyTokenObtainPairSerializer, EmployerRegisterSerializer, JobSeekerRegisterSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password
from api.serializers import ChangePasswordSerializer

class MyTokenObtainPairView(TokenObtainPairView):
	serializer_class = MyTokenObtainPairSerializer

class EmployerRegisterView(generics.CreateAPIView):
	queryset = Employer.objects.all()
	permission_classes = ([AllowAny])
	serializer_class = EmployerRegisterSerializer

class JobSeekerRegisterView(generics.CreateAPIView):
	queryset = JobSeeker.objects.all()
	permission_classes = ([AllowAny])
	serializer_class = JobSeekerRegisterSerializer

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.validated_data.get("old_password")
            new_password = serializer.validated_data.get("new_password")
            confirm_password = serializer.validated_data.get("confirm_password")
            
            if not check_password(old_password, instance.password):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            if new_password != confirm_password:
                return Response({"error": "New password and confirm password do not match."}, status=status.HTTP_400_BAD_REQUEST)
            instance.set_password(new_password)
            instance.save()
            return Response({"message": "Password changed successfully."})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)