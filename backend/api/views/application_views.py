from rest_framework import generics
from api.models import Application, EmployerJobRelation,Employer
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
        user = self.request.user
        obj = super().get_object()
        
        if hasattr(user, 'jobseeker'):
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

            if not employer.company == job_company:
                raise PermissionDenied("You do not have permission to view this application.")
            if not employer.is_company_admin:
                if not user.id in employer_ids:
                    raise PermissionDenied("You do not have permission to view this application.")
        print(obj.resume.github)
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