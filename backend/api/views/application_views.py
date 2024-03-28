from rest_framework import generics
from api.models import Application, EmployerJobRelation,Employer
from api.serializers.application_serializer import ApplicationSerializer
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied
from api.matchmaker.matchmaker import *
from api.utils.send_email import send_job_application_confirmation, send_job_application_result

class BaseApplicationView:
    '''Base view for the Application model.'''
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

class ApplicationListView(BaseApplicationView, generics.ListAPIView):
    '''List all applications.'''
    pass

class ApplicationRetrieveView(BaseApplicationView, generics.RetrieveAPIView):
    '''Retrieve an application. The application id is passed as a parameter in the url.'''

    def get_object(self):
        user = self.request.user
        obj = super().get_object()

        if hasattr(user, 'jobseeker'): # Job Seeker can only see their own applications
            if not obj.job_seeker.id == user.id:
                raise PermissionDenied("You do not have permission to view this application.")
        else:
            try:
                job_id = obj.job.id
                employer = Employer.objects.get(user_ptr_id = user.id)
                employer_ids = EmployerJobRelation.objects.filter(job_id=job_id).values_list('employer', flat=True)
                job_company = Employer.objects.get(id=employer_ids[0]).company
            except:
                raise PermissionDenied("You do not have permission to view this application.")

            if not employer.company == job_company:  # Employers can only see applications in their own company
                raise PermissionDenied("You do not have permission to view this application.")
            if not employer.is_company_admin:
                if not user.id in employer_ids: # Employers can only see applications for their own jobs or all jobs if they are admin
                    raise PermissionDenied("You do not have permission to view this application.")
        return obj

class JobSeekerApplicationRetrieveView(BaseApplicationView, generics.RetrieveAPIView):
    '''Retrieve an application. The application id is passed as a parameter in the url.'''
        
    def get_object(self):
        job_seeker_id = self.kwargs.get('job_seeker_id')
        job_id = self.kwargs.get('job_id')
        return get_object_or_404(Application, job_seeker_id=job_seeker_id, job_id=job_id)

class ApplicationCreateView(BaseApplicationView, generics.CreateAPIView):
    '''Create an application.'''
    def perform_create(self, serializer):
        instance = serializer.save()

        relation = EmployerJobRelation.objects.filter(job_id=instance.job.id).first()
        send_job_application_confirmation(instance.job_seeker.email, instance.job.title, relation.employer.company.company_name)

class ApplicationUpdateView(BaseApplicationView, generics.RetrieveUpdateDestroyAPIView):
    '''Update an application. The application id is passed as a parameter in the url.'''
    def perform_update(self, serializer):
        before_decision = self.get_object().status
        instance = serializer.save()
        
        # Send email to job seeker if the decision has changed
        if before_decision != instance.decision and instance.decision == 'A':
            relation = EmployerJobRelation.objects.filter(job_id=instance.job.id).first()
            send_job_application_result(instance.job_seeker.email, instance.job.title, relation.employer.company.company_name, True)
        elif before_decision != instance.decision and instance.decision == 'R':
            relation = EmployerJobRelation.objects.filter(job_id=instance.job.id).first()
            send_job_application_result(instance.job_seeker.email, instance.job.title, relation.employer.company.company_name, False)

class ApplicationsFromJobListView(BaseApplicationView, generics.ListAPIView):
    '''Return applications with the same job'''
    def get_queryset(self):
        user = self.request.user
        job_id = self.kwargs.get('job_id')

        if hasattr(user, 'jobseeker'): # Job Seeker can't see applications for a job
            raise PermissionDenied("You do not have permission to view applications.")
        else:
            try:
                employer = Employer.objects.get(user_ptr_id = user.id)
                employer_ids = EmployerJobRelation.objects.filter(job_id=job_id).values_list('employer', flat=True)
                job_company = Employer.objects.get(id=employer_ids[0]).company
            except:
                raise PermissionDenied("You do not have permission to view applications.")

        if not employer.company == job_company:  # Employers can only see application lists in their own company
            raise PermissionDenied("You do not have permission to view this application.")
        
        if employer.is_company_admin or employer.id in employer_ids: # Employers can only see application list for their own jobs or all jobs if they are admin
            applications = Application.objects.filter(job_id = job_id)
            return getMatchedApplicationsForJob(Job.objects.get(id=job_id), applications) # Match applications to job
        else:
            raise PermissionDenied("You do not have permission to view this application.")
        