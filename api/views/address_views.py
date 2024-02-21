from rest_framework import generics
from api.models import Address, Job
from api.serializers.address_serializer import AddressSerializer
from django.shortcuts import get_object_or_404

class BaseAddressView:
    queryset = Address.objects.all()
    serializer_class = AddressSerializer

class AddressListView(BaseAddressView, generics.ListAPIView):
    pass

class AddressRetrieveView(BaseAddressView, generics.RetrieveAPIView):
    pass

class AddressRetrieveJobView(BaseAddressView, generics.RetrieveAPIView):
    def get_object(self):
        job_id = self.kwargs['pk']
        job = get_object_or_404(Job, id=job_id)
        return job.address

class AddressCreateView(BaseAddressView, generics.CreateAPIView):
    pass

class AddressUpdateView(BaseAddressView, generics.RetrieveUpdateDestroyAPIView):
    #updateAPIView works but doesnt show the current data of the fields
    pass

        