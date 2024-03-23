from rest_framework import generics
from api.serializers.job_seeker_serializers import JobSeekerSerializer
from api.models import JobSeeker, Job, Application, EmployerJobRelation,Employer
from api.serializers import JobSeekerSerializer, ChangePasswordSerializer
from api.matchmaker.matchmaker import *
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password


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


class JobSeekerChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.validated_data.get("old_password")
            new_password = serializer.validated_data.get("new_password")
            confirm_password = serializer.validated_data.get("confirm_password")


            if not check_password(old_password, instance.password):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            
            if new_password != confirm_password:
                return Response({"error": "New password and confirm password do not match."}, status=status.HTTP_400_BAD_REQUEST)


            instance.set_password(new_password)
            instance.save()
            return Response({"message": "Password changed successfully."})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
