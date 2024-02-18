from rest_framework import generics
from rest_framework.permissions import AllowAny

from api.models import Job

from api.serializers.job_serializer import JobSerializer


class JobCreationView(generics.CreateAPIView):
	queryset = Job.objects.all()
	permission_classes = ([AllowAny])
	serializer_class = JobSerializer


