from django.test import TestCase
from api.models import Resume, SoftSkill, TechnicalSkill, Language, ProfessionalExperience, Education
from api.serializers import ResumeSerializer, ResumeSoftSkillSerializer, ResumeTechnicalSkillSerializer, ResumeLanguageSerializer, ProfessionalExperienceSerializer, EducationSerializer
import datetime

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
    
    def test_serializer_fields(self):
        serializer = EducationSerializer()
        expected_fields = {'id' ,'start_date', 'end_date', 'level', 'institution','grade', 'address'}
        self.assertEqual(set(serializer.fields.keys()), expected_fields)


    def test_serializer_data(self):
        expected_data = {
            'id': self.education.id,
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