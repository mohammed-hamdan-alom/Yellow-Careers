from rest_framework import generics
from api.models import Employer
from api.serializers.employer_serializer import EmployerSerializer


class BaseEmployerView:
    queryset = Employer.objects.all()
    serializer_class = EmployerSerializer

class EmployerListView(BaseEmployerView, generics.ListAPIView):
    pass

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