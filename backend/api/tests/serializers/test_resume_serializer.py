from django.test import TestCase
from api.models import Resume, SoftSkill, TechnicalSkill, Language, ProfessionalExperience, Education, Address
from api.serializers import ResumeSerializer, ResumeSoftSkillSerializer, ResumeTechnicalSkillSerializer, ResumeLanguageSerializer, ProfessionalExperienceSerializer, EducationSerializer, AddressSerializer
import datetime
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate
from api.views.resume_views import *



class ResumeSerializerTestCase(TestCase):

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
        self.resume = Resume.objects.get(pk=1)
        self.serializer = ResumeSerializer(instance=self.resume)
    
    def test_serializer_fields(self):
        serializer = ResumeSerializer()
        expected_fields = {'id','github','linkedin', 'about', 'experience'}
        self.assertEqual(set(serializer.fields.keys()), expected_fields)


    def test_serializer_data(self):
        expected_data = {
            'id' : self.resume.id,
            'github' : self.resume.github,
            'linkedin' : self.resume.linkedin,
            'about' : self.resume.about,
            'experience' : self.resume.experience
        }
        self.assertEqual(self.serializer.data, expected_data)

    
    def test_serializer_validation(self):
        # Test resume with empty data - is valid
        serializer = ResumeSerializer(data={})
        self.assertTrue(serializer.is_valid())


        # Test validation with invalid data (missing required fields)
        invalid_data = {
            'githubb' : 'random', #doesn't exist
            'linkedin' : 'random',
            'about' : 'random',
            'experience' :'random'
        }
        serializer = ResumeSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())


class ResumeSoftSkillSerializerTestCase(TestCase):

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
        self.soft_skill = SoftSkill.objects.get(pk=1)
        self.serializer = ResumeSoftSkillSerializer(instance=self.soft_skill)
    
    def test_serializer_fields(self):
        serializer = ResumeSoftSkillSerializer()
        expected_fields = {'id','skill'}
        self.assertEqual(set(serializer.fields.keys()), expected_fields)


    def test_serializer_data(self):
        expected_data = {
            'id' : self.soft_skill.id,
            'skill' : self.soft_skill.skill,
        }
        self.assertEqual(self.serializer.data, expected_data)

    
    def test_serializer_validation(self):
        # Test validation with empty data
        serializer = ResumeSoftSkillSerializer(data={})
        self.assertFalse(serializer.is_valid())


        # Test validation with invalid data (missing required fields)
        invalid_data = {
            'incorrect_field': 'random',
        }
        serializer = ResumeSoftSkillSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())


class ResumeTechnicalSkillSerializerTestCase(TestCase):

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
        self.technical_skill = TechnicalSkill.objects.get(pk=1)
        self.serializer = ResumeTechnicalSkillSerializer(instance=self.technical_skill)
    
    def test_serializer_fields(self):
        serializer = ResumeTechnicalSkillSerializer()
        expected_fields = {'id','skill'}
        self.assertEqual(set(serializer.fields.keys()), expected_fields)


    def test_serializer_data(self):
        expected_data = {
            'id' : self.technical_skill.id,
            'skill' : self.technical_skill.skill,
        }
        self.assertEqual(self.serializer.data, expected_data)

    
    def test_serializer_validation(self):
        # Test validation with empty data
        serializer = ResumeTechnicalSkillSerializer(data={})
        self.assertFalse(serializer.is_valid())


        # Test validation with invalid data (missing required fields)
        invalid_data = {
            'incorrect_field': 'random',
        }
        serializer = ResumeTechnicalSkillSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())


class ResumeLanguageSerializerTestCase(TestCase):

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
        self.language = Language.objects.get(pk=1)
        self.serializer = ResumeLanguageSerializer(instance=self.language)
    
    def test_serializer_fields(self):
        serializer = ResumeLanguageSerializer()
        expected_fields = {'id','language', 'spoken_proficiency', 'written_proficiency'}
        self.assertEqual(set(serializer.fields.keys()), expected_fields)


    def test_serializer_data(self):
        expected_data = {
            'id' : self.language.id,
            'language' : self.language.language,
            'spoken_proficiency' : self.language.spoken_proficiency,
            'written_proficiency' : self.language.written_proficiency,
        }
        self.assertEqual(self.serializer.data, expected_data)

    
    def test_serializer_validation(self):
        # Test validation with empty data
        serializer = ResumeLanguageSerializer(data={})
        self.assertFalse(serializer.is_valid())


        # Test validation with invalid data (incorrect field names)
        invalid_data = {
            'incorrect_field': 'random',
            'spoken_proficiency' : 'B',
            'written_proficiency' : 'B'
        }
        serializer = ResumeLanguageSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())

class ProfessionalExperienceSerializerTestCase(TestCase):

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
        self.professional_experience = ProfessionalExperience.objects.get(pk=1)
        self.serializer = ProfessionalExperienceSerializer(instance=self.professional_experience)
    
    def test_serializer_fields(self):
        serializer = ProfessionalExperienceSerializer()
        expected_fields = {'id' ,'start_date', 'end_date', 'company', 'position','description', 'address'}
        self.assertEqual(set(serializer.fields.keys()), expected_fields)


    def test_serializer_data(self):
        expected_data = {
            'id' : self.professional_experience.id,
            'start_date' : str(self.professional_experience.start_date),
            'end_date' : str(self.professional_experience.end_date),
            'company' : self.professional_experience.company,
            'position' : self.professional_experience.position,
            'description' : self.professional_experience.description,
            'address': {
                'id': self.professional_experience.address.id,
                'city': self.professional_experience.address.city,
                'post_code': self.professional_experience.address.post_code,
                'country': self.professional_experience.address.country
        }
        }
        self.assertEqual(self.serializer.data, expected_data)

    
    def test_serializer_validation(self):
        # Test validation with empty data
        serializer = ProfessionalExperienceSerializer(data={})
        self.assertFalse(serializer.is_valid())


        # Test validation with invalid data (incorrect format for date)
        invalid_data = {
            'incorrect_field': 'random',
            'start_date' : '12-02-2003',
            'end_date' : '12-02-2004',
            'company' : 2,
            'position' : 'manager',
            'description' : 'random',
            'address': 1
        }
        serializer = ProfessionalExperienceSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
    

    def test_update_professional_experience(self):

        self.resume2 = Resume.objects.create(
            github="https://github.com/test",
            linkedin="https://linkedin.com/test",
            about="I am a test developer",
            experience="I have 2 years of experience")
        
        self.address2 = Address.objects.create(city='London', post_code='12345', country='UK')

    
        professional_experience = ProfessionalExperience.objects.create(
            start_date="2000-01-01",
            end_date="2005-01-01",
            company="nice company",
            position="boss",
            resume=self.resume2,
            address=self.address2 
        )

        updated_data = {
            'start_date': '2003-02-20',
            'end_date': '2014-01-01',
            'company': 'HS',
            'position': 'Updated pos',
            'address': {
                'city': 'Updated City',
                'post_code': '12345',
                'country': 'Updated Country'
            }
        }

        # Call the update method of the serializer with the instance and updated data
        updated_serializer = ProfessionalExperienceSerializer(instance=self.professional_experience, data=updated_data, partial=True)
        self.assertTrue(updated_serializer.is_valid())
        updated_instance = updated_serializer.save()

        updated_professional_experience_instance = updated_serializer.save()

        #Assert that the instance attributes are updated correctly
        self.assertIsNotNone(updated_professional_experience_instance)
        self.assertEqual(updated_professional_experience_instance.start_date, datetime.date(2003, 2, 20))
        self.assertEqual(updated_professional_experience_instance.end_date, datetime.date(2014, 1, 1))
        self.assertEqual(updated_professional_experience_instance.company, updated_data['company'])
        self.assertEqual(updated_professional_experience_instance.position, updated_data['position'])

        #Assert that the address of the instance is updated correctly
        updated_address = updated_instance.address
        self.assertEqual(updated_address.city, updated_data['address']['city'])
        self.assertEqual(updated_address.post_code, updated_data['address']['post_code'])
        self.assertEqual(updated_address.country, updated_data['address']['country'])


class EducationSerializerTestCase(TestCase):

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
        self.education = Education.objects.get(pk=1)
        self.serializer = EducationSerializer(instance=self.education)
        self.address = Address.objects.get(pk=1)
    
    def test_serializer_fields(self):
        serializer = EducationSerializer()
        expected_fields = {'id','course_name' ,'start_date', 'end_date', 'level', 'institution','grade', 'address'}
        self.assertEqual(set(serializer.fields.keys()), expected_fields)


    def test_serializer_data(self):
        expected_data = {
            'id': self.education.id,
            'course_name': self.education.course_name,
            'start_date': str(self.education.start_date),
            'end_date': str(self.education.end_date),
            'level': self.education.level,
            'institution' : self.education.institution,
            'grade': self.education.grade,
            'address': {
                'id': self.education.address.id,
                'city': self.education.address.city,
                'post_code': self.education.address.post_code,
                'country': self.education.address.country
            }
        }
        self.assertEqual(self.serializer.data, expected_data)

        
    def test_serializer_validation(self):
        # Test validation with empty data
        serializer = EducationSerializer(data={})
        self.assertFalse(serializer.is_valid())


        # Test validation with invalid data (incorrect format for date)
        invalid_data = {
            'incorrect_field': 'random',
            'start_date' : '12-02-2003',
            'end_date' : '12-02-2004',
            'level' : 'HS',
            'institution' : 'random',
            'grade' : '1',
            'address': 1
        }
        serializer = EducationSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
    
    def test_update_education(self):

        self.resume3 = Resume.objects.create(
            github="https://github.com/test",
            linkedin="https://linkedin.com/test",
            about="I am a test developer",
            experience="I have 5 years of experience")
        
        self.address3 = Address.objects.create(city='London', post_code='12345', country='UK')

    
        education_instance = Education.objects.create(
            course_name="Sample Course",
            start_date="2000-01-01",
            end_date="2005-01-01",
            level="HS",
            institution="Sample Institution",
            grade="A",
            resume=self.resume3,
            address=self.address3 
        )

        updated_data = {
            'course_name': 'Updated Course Name',
            'start_date': '2003-02-20',
            'end_date': '2014-01-01',
            'level': 'HS',
            'institution': 'Updated Institution',
            'grade': 'B',
            'address': {
                'city': 'Updated City',
                'post_code': '12345',
                'country': 'Updated Country'
            }
        }

        # Call the update method of the serializer with the instance and updated data
        updated_serializer = EducationSerializer(instance=self.education, data=updated_data, partial=True)
        self.assertTrue(updated_serializer.is_valid())
        updated_instance = updated_serializer.save()

        #Assert that the instance attributes are updated correctly
        self.assertEqual(updated_instance.course_name, updated_data['course_name'])
        self.assertEqual(updated_instance.start_date, datetime.date(2003, 2, 20))  
        self.assertEqual(updated_instance.end_date, datetime.date(2014, 1, 1))
        self.assertEqual(updated_instance.level, updated_data['level'])
        self.assertEqual(updated_instance.institution, updated_data['institution'])
        self.assertEqual(updated_instance.grade, updated_data['grade'])

        #Assert that the address of the instance is updated correctly
        updated_address = updated_instance.address
        self.assertEqual(updated_address.city, updated_data['address']['city'])
        self.assertEqual(updated_address.post_code, updated_data['address']['post_code'])
        self.assertEqual(updated_address.country, updated_data['address']['country'])

    # def test_create_resume_education(self):
    #     self.resume4 = Resume.objects.create(
    #         github="https://github.com/test4",
    #         linkedin="https://linkedin.com/test4",
    #         about="I am a test developer",
    #         experience="I have 5 years of experience")

    #     self.resume4.save()
        
    #     self.address4 = Address.objects.create(city='London', post_code='15', country='USA')

    #     self.address4.save()
    #     education_data = {
    #         'course_name': 'Course',
    #         'start_date': '2003-02-20',
    #         'end_date': '2014-01-01',
    #         'level': 'HS',
    #         'institution': 'NEW Institution',
    #         'grade': 'A',
    #         'resume':self.resume4,
    #         'address': {
    #             'city': 'NICE City',
    #             'post_code': '123',
    #             'country': 'NICE Country'
    #         }
    #     }
    #     serializer = EducationSerializer(data=education_data)
    #     self.assertTrue(serializer.is_valid())
    #     ##education_instance = serializer.save()
    #     ##self.assertIsNotNone(education_instance)

    # def test_create_resume_education(self):

    #     address_data = {
    #         'city': "random",
    #         'post_code': "RNDM12",
    #         'country': "RANDOM"
    #     }

    #     # Serialize address data to create an Address object
    #     serializer = AddressSerializer(data=address_data)
    #     self.assertTrue(serializer.is_valid())
    #     address = serializer.save()


    #     education_data = {
    #         'course_name' : "random name",
    #         'start_date': "2003-02-20",
    #         'end_date': "2014-01-01",
    #         'level': "HS",
    #         'institution' :"asdasd",
    #         'grade': "a",
    #         'address': address
    #     }

    #     factory = APIRequestFactory()
    #     request = factory.post(reverse('resume-educations-post'), education_data, format='json')

    #     ##force_authenticate(request,user=self.employee)

    #     view = EducationCreateView.as_view()
    #     response = view(request, pk=self.education.resume.id)



        # response = self.client.post(reverse('resume-educations-post', args=[1]), education_data, format='json')
        # print(response.data)
        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)
