from rest_framework import generics
from api.models import JobSeeker, Application
from api.serializers.job_seeker_serializers import JobSeekerSerializer


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

class ApplicationJobSeekerListView(BaseJobSeekerView, generics.ListAPIView):
        
    def get_queryset(self):
        job_id = self.kwargs.get('job_id')
        return Application.objects.filter(job_id = job_id)