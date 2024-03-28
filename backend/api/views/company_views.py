from rest_framework import generics
from api.models import Company, EmployerJobRelation
from api.serializers.company_serializer import CompanySerializer


class BaseCompanyView:
    '''Base view for Company views. Contains the queryset and serializer_class attributes.'''
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class CompanyListView(BaseCompanyView, generics.ListAPIView):
    '''List all companies.'''
    pass

class CompanyRetrieveView(BaseCompanyView, generics.RetrieveAPIView):
    '''Retrieve a company. The company id is passed as a parameter in the url.'''
    pass

class JobCompanyRetrieveView(BaseCompanyView, generics.RetrieveAPIView):
    '''Retrieve the company of a job. The job id is passed as a parameter in the url.'''
    def get_object(self):
        job_id = self.kwargs['pk']
        relation = EmployerJobRelation.objects.filter(job_id=job_id).first()
        return relation.employer.company

class CompanyCreateView(BaseCompanyView, generics.CreateAPIView):
    '''Create a company.'''
    pass

class CompanyUpdateView(BaseCompanyView, generics.RetrieveUpdateDestroyAPIView):
    '''Update a company. The company id is passed as a parameter in the url.'''
    pass