from rest_framework import generics
from api.models import EmployerJobRelation
from api.serializers.employer_job_relation_serializer import EmployerJobRelationSerializer
from django.shortcuts import get_object_or_404

class BaseEmployerJobRelationView:
    queryset = EmployerJobRelation.objects.all()
    serializer_class = EmployerJobRelationSerializer

class EmployerJobRelationListView(BaseEmployerJobRelationView, generics.ListAPIView):
    pass

class EmployerJobRelationRetrieveView(BaseEmployerJobRelationView, generics.RetrieveAPIView):
    pass

class EmployerJobRelationCreateView(BaseEmployerJobRelationView, generics.CreateAPIView):
    pass

class EmployerJobRelationUpdateView(BaseEmployerJobRelationView, generics.RetrieveUpdateDestroyAPIView):
    pass

class EmployerJobRelationDestroyView(BaseEmployerJobRelationView, generics.RetrieveUpdateDestroyAPIView):
    def get_object(self):
        job = self.kwargs.get('job_id')
        employer = self.kwargs.get('employer_id')
        return get_object_or_404(EmployerJobRelation, job=job, employer=employer)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
