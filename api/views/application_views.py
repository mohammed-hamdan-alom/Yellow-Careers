from rest_framework import generics
from api.models import Application
from api.serializers.application_serializer import ApplicationSerializer


class BaseApplicationView:
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

class ApplicationListView(BaseApplicationView, generics.ListAPIView):
    pass

class ApplicationRetrieveView(BaseApplicationView, generics.RetrieveAPIView):
    pass

class ApplicationCreateView(BaseApplicationView, generics.CreateAPIView):
    pass

class ApplicationUpdateView(BaseApplicationView, generics.RetrieveUpdateDestroyAPIView):
    pass