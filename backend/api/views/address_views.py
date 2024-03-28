from rest_framework import generics
from api.models import Address, Job
from api.serializers.address_serializer import AddressSerializer
from django.shortcuts import get_object_or_404

class BaseAddressView:
    '''Base view for the Address model.'''
    queryset = Address.objects.all()
    serializer_class = AddressSerializer

class AddressListView(BaseAddressView, generics.ListAPIView):
    '''List all addresses.'''
    pass

class AddressRetrieveView(BaseAddressView, generics.RetrieveAPIView):
    '''Retrieve an address. The address id is passed as a parameter in the url.'''
    pass

class AddressRetrieveJobView(BaseAddressView, generics.RetrieveAPIView):
    '''Retrieve the address of a job. The job id is passed as a parameter in the url.'''
    def get_object(self):
        job_id = self.kwargs['pk']
        job = get_object_or_404(Job, id=job_id)
        return job.address

class AddressCreateView(BaseAddressView, generics.CreateAPIView):
    '''Create an address.'''
    pass

class AddressUpdateView(BaseAddressView, generics.RetrieveUpdateDestroyAPIView):
    '''updateAPIView works but doesnt show the current data of the fields'''
    pass

        