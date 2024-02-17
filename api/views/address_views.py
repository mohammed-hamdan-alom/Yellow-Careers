from rest_framework import generics
from api.models import Address
from api.serializers.address_serializer import AddressSerializer


class BaseAddressView:
    queryset = Address.objects.all()
    serializer_class = AddressSerializer

class AddressListView(BaseAddressView, generics.ListAPIView):
    pass

class AddressRetrieveView(BaseAddressView, generics.RetrieveAPIView):
    pass

class AddressCreateView(BaseAddressView, generics.CreateAPIView):
    pass

class AddressUpdateView(BaseAddressView, generics.RetrieveUpdateDestroyAPIView):
    #updateAPIView works but doesnt show the current data of the fields
    pass

        