from rest_framework import generics
from api.models import Application
from api.serializers.application_serializer import ApplicationSerializer
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied

class BaseApplicationView:
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

class ApplicationListView(BaseApplicationView, generics.ListAPIView):
    pass

class ApplicationRetrieveView(BaseApplicationView, generics.RetrieveAPIView):
    def get_object(self):
        obj = super().get_object()
        if not obj.job_seeker.id == self.request.user.id:
            raise PermissionDenied("You do not have permission to view this application.")
        return obj

class JobSeekerApplicationRetrieveView(BaseApplicationView, generics.RetrieveAPIView):
        
    def get_object(self):
        job_seeker_id = self.kwargs.get('job_seeker_id')
        job_id = self.kwargs.get('job_id')
        return get_object_or_404(Application, job_seeker_id=job_seeker_id, job_id=job_id)

class ApplicationCreateView(BaseApplicationView, generics.CreateAPIView):
    pass

class ApplicationUpdateView(BaseApplicationView, generics.RetrieveUpdateDestroyAPIView):
    pass