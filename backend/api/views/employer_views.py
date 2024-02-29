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

class EmployerUpdateView(BaseEmployerView, generics.RetrieveUpdateDestroyAPIView):
    pass