from rest_framework import generics
from api.models import Employer, EmployerJobRelation
from api.serializers import EmployerSerializer, ChangePasswordSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password
from rest_framework.response import Response
from rest_framework import generics, status


class BaseEmployerView:
    queryset = Employer.objects.all()
    serializer_class = EmployerSerializer

class EmployerListView(BaseEmployerView, generics.ListAPIView):
    pass

class LinkedEmployersView(BaseEmployerView, generics.ListAPIView):
    '''Retrieve all employers linked to a job. The job id is passed as a parameter in the url.'''
    def get_queryset(self):
        job_id = self.kwargs["pk"]
        employerjobrelations = EmployerJobRelation.objects.filter(job_id=job_id)
        return [employerjobrelation.employer for employerjobrelation in employerjobrelations]

class CompanyEmployersView(BaseEmployerView, generics.ListAPIView):
    '''Retrieve all employers in a company. The employer id is passed as a parameter in the url.'''
    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        employer = get_object_or_404(Employer, id=user_id)
        return Employer.objects.filter(company_id=employer.company)

class EmployerRetrieveView(BaseEmployerView, generics.RetrieveAPIView):
    pass

class EmployerCreateView(BaseEmployerView, generics.CreateAPIView):
    pass
    
class CompanyEmployerListView(BaseEmployerView, generics.ListAPIView):
    '''Retrieve all employers in a company. The company id is passed as a parameter in the url.'''
    def get_queryset(self):
        company_id = self.kwargs['pk']
        return Employer.objects.filter(company_id=company_id)

class EmployerUpdateView(BaseEmployerView, generics.RetrieveUpdateDestroyAPIView):
    pass
