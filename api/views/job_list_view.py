from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework import generics
from rest_framework.response import Response

from api.models import Job, Address

from api.serializers.job_serializer import JobSerializer
from api.serializers.address_serializer import AddressSerializer


class JobListingView(generics.ListAPIView):
    queryset = Job.objects.all()
    permission_classes = ([AllowAny])
    serializer_class = JobSerializer

    def list(self, request):
        jobs = self.get_queryset()
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    
class JobRetrieveView(generics.RetrieveAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    
class AddressRetrieveView(generics.RetrieveAPIView):
    queryset = Address.objects.all()
    permission_classes = ([AllowAny])
    serializer_class = AddressSerializer