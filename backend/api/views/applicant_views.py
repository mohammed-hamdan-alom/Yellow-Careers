from rest_framework import generics
from api.models import JobSeeker, Job, Application, EmployerJobRelation,Employer
from api.serializers import JobSeekerSerializer
from django.shortcuts import get_object_or_404
from api.matchmaker.matchmaker import *
from rest_framework.exceptions import PermissionDenied



class BaseApplicantView:
    queryset = JobSeeker.objects.all()
    serializer_class = JobSeekerSerializer

class ApplicantListView(BaseApplicantView, generics.ListAPIView):
    def get_queryset(self):
        employer = Employer.objects.get(user_ptr_id=self.request.user.id)
        job_id = self.kwargs["pk"]
        employer_ids = EmployerJobRelation.objects.filter(job_id=job_id).values_list('employer', flat=True)
        job_company = Employer.objects.get(id=employer_ids[0]).company
        if not employer.company == job_company:
            raise PermissionDenied("You do not have permission to view this application.")
        
        if employer.is_company_admin or employer.id in employer_ids:
            job_id = self.kwargs["pk"]
            applications = Application.objects.filter(job_id = job_id)
            return [application.job_seeker for application in applications]
        else:
            raise PermissionDenied("You do not have permission to view this application.")

class JobSeekerRetrieveView(BaseApplicantView, generics.RetrieveAPIView):
    pass