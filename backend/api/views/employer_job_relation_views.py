from rest_framework import generics
from api.models import EmployerJobRelation
from api.serializers.employer_job_relation_serializer import EmployerJobRelationSerializer


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