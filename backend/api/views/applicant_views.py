from rest_framework import generics
from api.models import JobSeeker, Job, Application
from api.serializers import JobSeekerSerializer
from django.shortcuts import get_object_or_404


class BaseApplicantView:
    queryset = JobSeeker.objects.all()
    serializer_class = JobSeekerSerializer

class ApplicantListView(BaseApplicantView, generics.ListAPIView):
    def get_queryset(self):
        job_id = self.kwargs["pk"]
        applications = Application.objects.filter(job_id = job_id)
        return [application.job_seeker for application in applications]

class JobSeekerRetrieveView(BaseApplicantView, generics.RetrieveAPIView):
    pass