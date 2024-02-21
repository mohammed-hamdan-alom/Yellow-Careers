from rest_framework import generics
from api.models import Resume
from api.serializers.resume_serializer import ResumeSerializer
from django.shortcuts import get_object_or_404
from api.models import JobSeeker


class BaseResumeView:
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

class ResumeListView(BaseResumeView, generics.ListAPIView):
    pass

class ResumeRetrieveView(BaseResumeView, generics.RetrieveAPIView):
    pass

class UserResumeRetrieveView(BaseResumeView, generics.RetrieveAPIView):
    '''Retrieve the resume of a job seeker. The job seeker id is passed as a parameter in the url.'''
    def get_object(self):
        job_seeker_id = self.kwargs['pk']
        job_seeker = get_object_or_404(JobSeeker, id=job_seeker_id)
        return job_seeker.resume
    
class ResumeCreateView(BaseResumeView, generics.CreateAPIView):
    pass

class ResumeUpdateView(BaseResumeView, generics.RetrieveUpdateDestroyAPIView):
    pass