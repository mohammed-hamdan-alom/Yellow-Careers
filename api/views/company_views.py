from rest_framework import generics
from api.models import Company,EmployerJobRelation, Job
from api.serializers.company_serializer import CompanySerializer


class BaseCompanyView:
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class CompanyListView(BaseCompanyView, generics.ListAPIView):
    pass

class CompanyRetrieveView(BaseCompanyView, generics.RetrieveAPIView):
    pass

class JobCompanyRetrieveView(BaseCompanyView, generics.RetrieveAPIView):
    
    def get_object(self):
        job_id = self.kwargs['pk']
        print(job_id)
        relation = EmployerJobRelation.objects.filter(job_id=job_id).first()
        print(relation)
        employer = relation.employer
        print(employer)
        return employer.company

class CompanyCreateView(BaseCompanyView, generics.CreateAPIView):
    pass

class CompanyUpdateView(BaseCompanyView, generics.RetrieveUpdateDestroyAPIView):
    pass