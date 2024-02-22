from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404

from api.models import Job, Address, Application, JobSeeker

from api.serializers.job_serializer import JobSerializer
from api.serializers.address_serializer import AddressSerializer

class JobCreationView(generics.CreateAPIView):
	queryset = Job.objects.all()
	permission_classes = ([AllowAny])
	serializer_class = JobSerializer

class JobsAppliedListView(generics.ListAPIView):
    '''Retrieve the job of an application for a user. The job seekers id is passed as a parameter in the url.'''
    serializer_class = JobSerializer

    def get_queryset(self):
        job_seeker_id = self.kwargs['pk']
        job_seeker = get_object_or_404(JobSeeker, id=job_seeker_id)
        applications = Application.objects.filter(job_seeker=job_seeker)
        return [application.job for application in applications]
        
class AddressCreationView(generics.CreateAPIView):
	queryset = Address.objects.all()
	permission_classes = ([AllowAny])
	serializer_class = AddressSerializer