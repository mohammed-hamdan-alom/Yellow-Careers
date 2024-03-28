from django.test import TestCase
from django.core.exceptions import ValidationError
from api.models import Company

class CompanyModelTestCase(TestCase):
    '''Test case for the Company model'''

    fixtures = ['api/tests/fixtures/companies.json']
    
    def setUp(self):
        self.company = Company.objects.get(pk=1)
    
    def test_valid_company(self):
        self._assert_company_is_valid()
    
    def test_company_name_cannot_be_blank(self):
        self.company.company_name = ''
        self._assert_company_is_invalid()
    
    def test_website_can_be_blank(self):
        self.company.website = ''
        self._assert_company_is_valid()
    
    def test_website_must_be_valid_url(self):
        self.company.website = 'invalid'
        self._assert_company_is_invalid()
    
    def test_company_cannot_be_more_than_100_characters(self):
        self.company.company_name = 'a'*101
        self._assert_company_is_invalid()

    def test_website_cannot_be_more_than_200_characters(self):
        self.company.website = 'a'*201
        self._assert_company_is_invalid()

    def test_company_name_does_not_have_to_be_unique(self):
        company = Company(company_name=self.company.company_name, website='https://www.company1.com')
        self._assert_company_is_valid()
    
    def test_website_does_not_have_to_be_unique(self):
        company = Company(company_name='Company 1', website=self.company.website)
        self._assert_company_is_valid()
    
    def test_about_can_be_blank(self):
        self.company.about = ''
        self._assert_company_is_valid()
    
    def test_about_cannot_be_more_than_1000_characters(self):
        self.company.about = 'a'*1001
        self._assert_company_is_invalid()
    
    def _assert_company_is_valid(self):
        self.company.full_clean()
    
    def _assert_company_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.company.full_clean()