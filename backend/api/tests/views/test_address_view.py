from django.test import TestCase
from api.models import Address
from django.urls import reverse
from rest_framework import status

class AddressViewTestCase(TestCase):

    # fixtures = ['api/tests/fixtures/addresses.json']

    fixtures = ['api/tests/fixtures/addresses.json',
                'api/tests/fixtures/answers.json',
                'api/tests/fixtures/applications.json',
                'api/tests/fixtures/companies.json',
                'api/tests/fixtures/employers.json',
                'api/tests/fixtures/jobs.json',
                'api/tests/fixtures/jobseekers.json',
                'api/tests/fixtures/questions.json',
                'api/tests/fixtures/resumes.json',
                'api/tests/fixtures/users.json',]

    def setUp(self):
        self.addresses = [Address.objects.get(pk=1), 
                          Address.objects.get(pk=2), 
                          Address.objects.get(pk=3),
                          Address.objects.get(pk=4)]
    
    def test_list_addresses(self):
        response = self.client.get(reverse('address-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.addresses))
    
    def test_retrieve_address(self):
        address = self.addresses[0]
        response = self.client.get(reverse('address-get', args=[address.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['city'], address.city)
        self.assertEqual(response.data['post_code'], address.post_code)
        self.assertEqual(response.data['country'], address.country) 
    
    def test_create_address(self):
        address_data = {
            'city' : 'Birmingham',
            'post_code' : 'BM9 8YH',
            'country' : 'UK'
        }
        response = self.client.post(reverse('address-post'), address_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Address.objects.count(), len(self.addresses) + 1)
    
    def test_update_address(self):
        address = self.addresses[0]
        updated_address_data = {
            'city' : 'Paris',
            'post_code': 'PL 45',
            'country' : 'France'
        }
        response = self.client.put(reverse('address-put', args=[address.id]), updated_address_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        address.refresh_from_db()
        self.assertEqual(address.city, updated_address_data['city'])
        self.assertEqual(address.post_code, updated_address_data['post_code'])
        self.assertEqual(address.country, updated_address_data['country'])
    
    def test_delete_address(self):
        address = self.addresses[0]
        response = self.client.delete(reverse('address-put', args=[address.id]), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Address.objects.count(), len(self.addresses) - 1)
    
    def test_invalid_update_address(self):
        address = self.addresses[0]
        updated_address_data = {
            'city' : 'k'*100,
            'post_code' : 'BM9 8YH',
            'country' : 'UK'
        }
        response = self.client.put(reverse('address-put', args=[address.id]), updated_address_data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Address.objects.count(), len(self.addresses))

    def test_create_invalid_address(self):
        address_data = {
            'city' : 'k'*100,
            'post_code' : 'BM9 8YH',
            'country' : 'UK'
        }
        response = self.client.post(reverse('address-post'), address_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Address.objects.count(), len(self.addresses))
    
    def test_retrieve_invalid_address(self):
        response = self.client.get(reverse('address-get', args=[100]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_delete_invalid_address(self):
        response = self.client.delete(reverse('address-put', args=[100]), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Address.objects.count(), len(self.addresses))

    