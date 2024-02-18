from django.shortcuts import render

from rest_framework.permissions import AllowAny
from rest_framework import generics
from rest_framework.response import Response

from api.models import Job

from api.serializers.job_serializer import JobSerializer


class JobListingView(generics.ListAPIView):
    queryset = Job.objects.all()
    permission_classes = ([AllowAny])
    serializer_class = JobSerializer

    def list(self, request):
        jobs = self.get_queryset()
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    
