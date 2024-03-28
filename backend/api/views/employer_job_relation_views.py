from rest_framework import generics
from api.models import EmployerJobRelation
from api.serializers.employer_job_relation_serializer import EmployerJobRelationSerializer
from django.shortcuts import get_object_or_404
from api.utils.send_email import send_job_access_notification

class BaseEmployerJobRelationView:
    queryset = EmployerJobRelation.objects.all()
    serializer_class = EmployerJobRelationSerializer

class EmployerJobRelationListView(BaseEmployerJobRelationView, generics.ListAPIView):
    pass

class EmployerJobRelationRetrieveView(BaseEmployerJobRelationView, generics.RetrieveAPIView):
    pass

class EmployerJobRelationCreateView(BaseEmployerJobRelationView, generics.CreateAPIView):
    def perform_create(self, serializer):
        instance = serializer.save()
        
        is_created_by_employer = EmployerJobRelation.objects.filter(job=instance.job).count() == 1
        send_job_access_notification(instance.employer.email, instance.job.title, instance.employer.company.company_name, is_created_by_employer)

class EmployerJobRelationUpdateView(BaseEmployerJobRelationView, generics.RetrieveUpdateDestroyAPIView):
    pass

class EmployerJobRelationDestroyView(BaseEmployerJobRelationView, generics.RetrieveUpdateDestroyAPIView):
    def get_object(self):
        job = self.kwargs.get('job_id')
        employer = self.kwargs.get('employer_id')
        return get_object_or_404(EmployerJobRelation, job=job, employer=employer)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
