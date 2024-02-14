from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import AllowAny

from api.models import Job, Address

from api.serializers.job_serializer import JobSerializer
from api.serializers.address_serializer import AddressSerializer

class JobCreationView(generics.CreateAPIView):
	queryset = Job.objects.all()
	permission_classes = ([AllowAny])
	serializer_class = JobSerializer

class AddressCreationView(generics.CreateAPIView):
	queryset = Address.objects.all()
	permission_classes = ([AllowAny])
	serializer_class = AddressSerializer