from django.test import TestCase
from api.models import JobSeeker, Address
from api.serializers import JobSeekerSerializer
from django.forms.models import model_to_dict
from collections import OrderedDict

class JobSeekerSerializerTestCase(TestCase):

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
        self.job_seeker = JobSeeker.objects.get(pk=1)
        self.job_seeker_address = Address.objects.get(pk=self.job_seeker.address_id)
        self.serializer = JobSeekerSerializer(instance=self.job_seeker)
    

    def test_serializer_fields(self):
        serializer = JobSeekerSerializer()
        expected_fields = {'id','first_name','last_name' ,'phone_number', 'email', 'other_names','dob', 'nationality', 'sex','address', 'resume'}
        self.assertEqual(set(serializer.fields.keys()), expected_fields)


    def test_serializer_data(self):
        expected_data = {
            'id': self.job_seeker.id,
            'first_name': self.job_seeker.first_name,
            'last_name': self.job_seeker.last_name,
            'other_names': self.job_seeker.other_names,
            'phone_number': self.job_seeker.phone_number,
            'email': self.job_seeker.email,
            'resume': self.job_seeker.resume_id,
            'dob': str(self.job_seeker.dob),
            'nationality': self.job_seeker.nationality,
            'address': OrderedDict(model_to_dict(self.job_seeker_address)),
            'sex': self.job_seeker.sex
        }
        self.assertEqual(self.serializer.data, expected_data)
    
    def test_serializer_validation(self):
        # Test validation with empty data
        serializer = JobSeekerSerializer(data={})
        self.assertFalse(serializer.is_valid())


        # Test validation with invalid data (missing required fields)
        invalid_data = {
            'first_name': 'random',
            'last_name' :'random',
            'email' : 'random@randommmm.com',
            'address' : 100
        }
        serializer = JobSeekerSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())

    def test_update_with_correct_address(self):
        new_address_data = {
            'city': 'New City',
            'country': 'New Country',
            'post_code': '12345'
        }

        serializer = JobSeekerSerializer(instance=self.job_seeker, data={'address': new_address_data}, partial=True)
        self.assertTrue(serializer.is_valid())
        if serializer.is_valid():
            updated_job_seeker = serializer.save()
            updated_job_seeker_address = updated_job_seeker.address

            self.assertEqual(updated_job_seeker_address.city, new_address_data['city'])
            self.assertEqual(updated_job_seeker_address.country, new_address_data['country'])
            self.assertEqual(updated_job_seeker_address.post_code, new_address_data['post_code'])
        else:
            self.fail("Serializer did not validate the update data correctly.")

    def test_update_with_invalid_address(self):
        new_address_data = {
            'city': 'New City',
            'country': '213', ##country needs to be a string
            'post_code': '12345'
        }

        serializer = JobSeekerSerializer(instance=self.job_seeker, data={'address': new_address_data}, partial=True)
        self.assertFalse(serializer.is_valid())
        self.assertEqual(serializer.errors['address']['country'][0], 'Enter a valid value.')

    def test_update_job_Seeker_without_address(self):
        new_job_seeker = JobSeeker.objects.create(
            first_name =  'John',
            last_name = 'Doe',
            email = 'noaddress@example.com',
            phone_number = '08012345678',
            is_active = True,
            dob = "1980-04-01",
            nationality = "Indian",
            sex = "F",
            resume = self.job_seeker.resume
        )
        address_data = {
            'city': 'New City',
            'country': 'New Country',
            'post_code': '12345'
        }
        serializer = JobSeekerSerializer(instance=new_job_seeker,  data={'address': address_data}, partial=True)
        self.assertTrue(serializer.is_valid())
        if serializer.is_valid():
            updated_job_seeker = serializer.save()
            self.assertEqual(updated_job_seeker.address.city, address_data['city'])
            self.assertEqual(updated_job_seeker.address.country, address_data['country'])
            self.assertEqual(updated_job_seeker.address.post_code, address_data['post_code'])







