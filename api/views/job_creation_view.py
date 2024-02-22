from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import AllowAny

from api.models import Job, Address, SavedJobs

from api.serializers.job_serializer import JobSerializer
from api.serializers.address_serializer import AddressSerializer

class JobCreationView(generics.CreateAPIView):
	queryset = Job.objects.all()
	permission_classes = ([AllowAny])
	serializer_class = JobSerializer

class JobSeekerSavedJobsListView(generics.ListAPIView):
	queryset = Job.objects.all()
	serializer_class = JobSerializer

	def get_queryset(self):
		job_seeker_id = self.kwargs['pk']
		saved_jobs = SavedJobs.objects.filter(job_seeker_id=job_seeker_id)
		return Job.objects.filter(savedjobs__in=saved_jobs)

class AddressCreationView(generics.CreateAPIView):
	queryset = Address.objects.all()
	permission_classes = ([AllowAny])
	serializer_class = AddressSerializer