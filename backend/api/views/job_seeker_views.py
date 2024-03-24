from rest_framework import generics
from api.serializers.job_seeker_serializers import JobSeekerSerializer
from api.models import JobSeeker, Job, Application, EmployerJobRelation,Employer
from api.serializers import JobSeekerSerializer
from api.matchmaker.matchmaker import *
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from rest_framework import generics


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

class ApplicantListView(BaseJobSeekerView, generics.ListAPIView):
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
            return getMatchedApplicantsForJob(Job.objects.get(id=job_id), [application.job_seeker for application in applications])
        else:
            raise PermissionDenied("You do not have permission to view this application.")

class JobSeekerFromApplicationRetrieveView(BaseJobSeekerView, generics.RetrieveAPIView):

    def get_object(self):
        application_id = self.kwargs["application_id"]
        application = get_object_or_404(Application, id=application_id)
        return application.job_seeker
