from rest_framework import generics
from api.models import Company
from api.serializers.company_serializer import CompanySerializer


class BaseCompanyView:
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class CompanyListView(BaseCompanyView, generics.ListAPIView):
    pass

class CompanyRetrieveView(BaseCompanyView, generics.RetrieveAPIView):
    pass

class CompanyCreateView(BaseCompanyView, generics.CreateAPIView):
    pass

class CompanyUpdateView(BaseCompanyView, generics.RetrieveUpdateDestroyAPIView):
    pass