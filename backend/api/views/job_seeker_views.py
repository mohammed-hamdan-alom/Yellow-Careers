from rest_framework import generics
from api.models import JobSeeker, Application
from api.serializers.job_seeker_serializers import JobSeekerSerializer
from django.shortcuts import get_object_or_404

class BaseJobSeekerView:
    queryset = JobSeeker.objects.all()
    serializer_class = JobSeekerSerializer

class JobSeekerListView(BaseJobSeekerView, generics.ListAPIView):
    pass

class JobSeekerRetrieveView(BaseJobSeekerView, generics.RetrieveAPIView):
    pass

class JobSeekerCreateView(BaseJobSeekerView, generics.CreateAPIView):
    pass

class JobSeekerUpdateView(BaseJobSeekerView, generics.RetrieveUpdateDestroyAPIView):
    pass

class JobSeekerFromApplicationRetrieveView(BaseJobSeekerView, generics.RetrieveAPIView):

    def get_object(self):
        application_id = self.kwargs["application_id"]
        application = get_object_or_404(Application, id=application_id)
        return application.job_seeker