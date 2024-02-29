from django.test import TestCase
from rest_framework.test import APIClient
from api.models import Address
from api.serializers import AddressSerializer

class AddressSerializerTestCase(TestCase):

    fixtures = ['api/tests/fixtures/addresses.json']
    
    def setUp(self):
        self.address_data = {
            'city' : 'London',
            'post_code' : 'e786y',
            'country' : 'UK'
        }
        self.serializer = AddressSerializer(data=self.address_data)
    
    def test_serializer_fields(self):
        serializer = AddressSerializer()
        expected_fields = {'id','city','post_code','country'}
        self.assertEqual(set(serializer.fields.keys()), expected_fields)

    def test_serializer_is_valid(self):
        self.assertTrue(self.serializer.is_valid())

    def test_create_address(self):
        if self.serializer.is_valid():
            address = self.serializer.save()
            self.assertEqual(address.city, self.address_data['city'])
            self.assertEqual(address.post_code, self.address_data['post_code'])
            self.assertEqual(address.country, self.address_data['country'])
        else:
            self.assertTrue(False)
        
    def test_update_address(self):
        existing_address = Address.objects.get(pk=1)
        updated_address_data = {
            'city' : 'Paris',
            'post_code': '12345',
            'country' : 'France'
        }
        serializer = AddressSerializer(instance=existing_address, data=updated_address_data)
        self.assertTrue(serializer.is_valid())
        updated_address = serializer.save()
        self.assertEqual(updated_address.city, updated_address_data['city'])
        self.assertEqual(updated_address.post_code, updated_address_data['post_code'])
        self.assertEqual(updated_address.country, updated_address_data['country'])


