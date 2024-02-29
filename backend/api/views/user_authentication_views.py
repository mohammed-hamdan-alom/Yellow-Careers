from django.shortcuts import render

from api.models import User, Employer, JobSeeker
from api.serializers import UserSerializer, MyTokenObtainPairSerializer, EmployerRegisterSerializer, JobSeekerRegisterSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.response import Response

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

