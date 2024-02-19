from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.response import Response
from api.models import JobSeeker
from api.serializers.job_seeker_serializers import JobSeekerSerializer

class JobSeekerUpdateView(generics.UpdateAPIView):
    queryset = JobSeeker.objects.all()
    print(list(queryset))
    serializer_class = JobSeekerSerializer

    def update(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        job_seeker = get_object_or_404(self.get_queryset(), id=user_id)
        serializer = self.get_serializer(job_seeker, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)