from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models import JobSeeker

from api.serializers.job_seeker_serializers import JobSeekerSerializer

@api_view(['PUT'])
def job_seeker_update(request, email):
    job_seeker = get_object_or_404(JobSeeker, email=email)
    serializer = JobSeekerSerializer(instance=job_seeker, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)