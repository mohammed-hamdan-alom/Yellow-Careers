from rest_framework import generics
from api.models import Employer, EmployerJobRelation
from api.serializers.employer_serializer import EmployerSerializer
from django.shortcuts import get_object_or_404

class BaseEmployerView:
    queryset = Employer.objects.all()
    serializer_class = EmployerSerializer

class EmployerListView(BaseEmployerView, generics.ListAPIView):
    pass

class LinkedEmployersView(BaseEmployerView, generics.ListAPIView):
    def get_queryset(self):
        job_id = self.kwargs["pk"]
        employerjobrelations = EmployerJobRelation.objects.filter(job_id=job_id)
        return [employerjobrelation.employer for employerjobrelation in employerjobrelations]

class CompanyEmployersView(BaseEmployerView, generics.ListAPIView):
    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        employer = get_object_or_404(Employer, id=user_id)
        return Employer.objects.filter(company_id=employer.company)

class EmployerRetrieveView(BaseEmployerView, generics.RetrieveAPIView):
    pass

class EmployerCreateView(BaseEmployerView, generics.CreateAPIView):
    pass

class EmployerUpdateView(BaseEmployerView, generics.RetrieveUpdateDestroyAPIView):
    pass