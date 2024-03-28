from rest_framework import generics
from api.serializers.job_seeker_serializers import JobSeekerSerializer
from api.models import JobSeeker, Application
from api.serializers import JobSeekerSerializer
from api.matchmaker.matchmaker import *
from django.shortcuts import get_object_or_404
from rest_framework import generics


class BaseJobSeekerView:
    '''Base view for the JobSeeker model.'''
    queryset = JobSeeker.objects.all()
    serializer_class = JobSeekerSerializer

class JobSeekerListView(BaseJobSeekerView, generics.ListAPIView):
    '''List all job seekers.'''
    pass

class JobSeekerRetrieveView(BaseJobSeekerView, generics.RetrieveAPIView):
    '''Retrieve a job seeker. The job seeker id is passed as a parameter in the url.'''
    pass

class JobSeekerCreateView(BaseJobSeekerView, generics.CreateAPIView):
    '''Create a job seeker.'''
    pass

class JobSeekerUpdateView(BaseJobSeekerView, generics.RetrieveUpdateDestroyAPIView):
    '''Update a job seeker. The job seeker id is passed as a parameter in the url.'''
    pass

class JobSeekerFromApplicationRetrieveView(BaseJobSeekerView, generics.RetrieveAPIView):
    '''Retrieve the job seeker of an application. The application id is passed as a parameter in the url.'''
    def get_object(self):
        application_id = self.kwargs["application_id"]
        application = get_object_or_404(Application, id=application_id)
        return application.job_seeker
