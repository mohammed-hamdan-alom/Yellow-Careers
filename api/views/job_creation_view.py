from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import AllowAny

from api.models import Job

from api.serializers.job_serializer import JobSerializer
from api.serializers.address_serializer import AddressSerializer

class JobCreationView(generics.CreateAPIView):
	queryset = Job.objects.all()
	permission_classes = ([AllowAny])
	serializer_class = JobSerializer


# @api_view(['POST'])
# def job_create(request):
#     serializer = JobSerializer(data=request.data)
#     if serializer.is_valid():
#         validated_data = serializer.validated_data
#         queryset = validated_data.get('address')
#         save_address(queryset)
#         serializer.save()
#         return Response(serializer.data, status=201)
#     return Response(serializer.errors, status=400)

# def save_address(data):
#     serializer = AddressSerializer(data=data)
#     if serializer.is_valid():
#         address = serializer.save()
#         return address.pk
#     return None