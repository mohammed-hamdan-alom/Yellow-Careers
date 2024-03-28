from django.test import TestCase
from django.core.exceptions import ValidationError
from api.models import Address

class AddressModelTestCase(TestCase):
    '''Test case for the Address model'''

    fixtures = ['api/tests/fixtures/addresses.json']

    def setUp(self):
        self.address = Address.objects.get(pk=1)
    
    def test_valid_address(self):
        self._assert_address_is_valid()
    
    def test_city_cannot_be_blank(self):
        self.address.city = ''
        self._assert_address_is_invalid()
    
    def test_post_code_cannot_be_blank(self):
        self.address.post_code = ''
        self._assert_address_is_invalid()
    
    def test_country_cannot_be_blank(self):
        self.address.country = ''
        self._assert_address_is_invalid()
    
    def test_city_cannot_be_null(self):
        self.address.city = None
        self._assert_address_is_invalid()   
    
    def test_post_code_cannot_be_null(self):
        self.address.post_code = None
        self._assert_address_is_invalid()
    
    def test_country_cannot_be_null(self):
        self.address.country = None
        self._assert_address_is_invalid()
    
    def test_city_cannot_be_longer_than_50_characters(self):
        self.address.city = 'a' * 51
        self._assert_address_is_invalid()
    
    def test_post_code_cannot_be_longer_than_50_characters(self):
        self.address.post_code = 'a' * 51
        self._assert_address_is_invalid()
    
    def test_country_cannot_be_longer_than_50_characters(self):
        self.address.country = 'a' * 51
        self._assert_address_is_invalid()   

    def test_city_cannot_contain_special_characters(self):
        self.address.city = 'a@'
        self._assert_address_is_invalid()
    
    def test_post_code_cannot_contain_special_characters(self):
        self.address.post_code = 'a@'
        self._assert_address_is_invalid()
    
    def test_country_cannot_contain_special_characters(self):
        self.address.country = 'a@'
        self._assert_address_is_invalid()
    
    def test_city_cannot_contain_numbers(self):
        self.address.city = 'a1'
        self._assert_address_is_invalid()
    
    def test_country_cannot_contain_numbers(self):
        self.address.country = 'a1'
        self._assert_address_is_invalid()
    
    def test_city_can_contain_spaces(self):
        self.address.city = 'a a'
        self._assert_address_is_valid()
    
    def test_country_can_contain_spaces(self):
        self.address.country = 'a a'
        self._assert_address_is_valid()
    
    def test_post_code_can_contain_spaces(self):
        self.address.post_code = 'a a'
        self._assert_address_is_valid()

    def test_to_string(self):
        expected_string = "London L9K 1AA United Kingdom"
        self.assertEqual(self.address.to_string(), expected_string)


    def _assert_address_is_valid(self):
        self.address.full_clean()

    def _assert_address_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.address.full_clean()