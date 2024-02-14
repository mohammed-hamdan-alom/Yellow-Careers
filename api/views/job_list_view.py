from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.models import Job

from api.serializers.job_serializer import JobSerializer

@api_view(['GET'])
def job_list(request):
    jobs = Job.objects.all()
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)