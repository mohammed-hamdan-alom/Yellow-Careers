from rest_framework import generics
from api.models import Application
from api.serializers.application_serializer import ApplicationSerializer
from django.shortcuts import get_object_or_404

class BaseApplicationView:
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

class ApplicationListView(BaseApplicationView, generics.ListAPIView):
    pass

class ApplicationRetrieveView(BaseApplicationView, generics.RetrieveAPIView):
    pass

class JobSeekerApplicationRetrieveView(BaseApplicationView, generics.RetrieveAPIView):
        
    def get_object(self):
        job_seeker_id = self.kwargs.get('job_seeker_id')
        job_id = self.kwargs.get('job_id')
        return get_object_or_404(Application, job_seeker_id=job_seeker_id, job_id=job_id)

class ApplicationCreateView(BaseApplicationView, generics.CreateAPIView):
    pass

class ApplicationUpdateView(BaseApplicationView, generics.RetrieveUpdateDestroyAPIView):
    pass

class ApplicationsFromJobListView(BaseApplicationView, generics.ListAPIView):
    '''Return applications with the same job'''
    def get_queryset(self):
        job_id = self.kwargs.get('job_id')
        return Application.objects.filter(job_id = job_id)