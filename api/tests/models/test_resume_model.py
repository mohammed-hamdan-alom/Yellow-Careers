"""Unit tests for the Resume model."""
from django.core.exceptions import ValidationError
from django.test import TestCase
from api.models import Resume
from api.models import SoftSkill
from api.models import TechnicalSkill
from api.models import Language
from api.models import Education
from api.models import User
from api.models import JobSeeker
from api.models import Employer

class UserModelTestCase(TestCase):
    """Unit tests for the User model"""

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
        self.technical_skill = TechnicalSkill.objects.get(pk=1)
        self.language = Language.objects.get(pk=1)
        self.education = Education.objects.get(pk=1)
        self.resume = Resume.objects.get(pk=1)

    #the tests below are for soft and technical skills
    def test_soft_skill_can_be_30_characters_long(self):
        self.soft_skill.skill = 'x'*30
        self._assert_is_valid(self.soft_skill)
    
    def test_soft_skill_cannot_be_over_30_characters_long(self):
        self.soft_skill.skill = 'x'*31
        self._assert_is_invalid(self.soft_skill)
    
    def test_resume_field_for_soft_skill_must_be_resume(self):
        with self.assertRaises(ValueError):
            self.soft_skill.resume = ''
    
    def test_soft_skill_resume_field_cannot_be_blank(self):
        self.soft_skill.resume = None
        self._assert_is_invalid(self.soft_skill)

    def test_technical_skill_can_be_30_characters_long(self):
        self.technical_skill.skill = 'x'*30
        self._assert_is_valid(self.technical_skill)
    
    def test_technical_skill_cannot_be_over_30_characters_long(self):
        self.technical_skill.skill = 'x'*31
        self._assert_is_invalid(self.technical_skill)
    
    def test_resume_field_for_technical_skill_must_be_resume(self):
        with self.assertRaises(ValueError):
            self.technical_skill.resume = ''
    
    def test_technical_skill_resume_field_cannot_be_blank(self):
        self.technical_skill.resume = None
        self._assert_is_invalid(self.technical_skill)


    #the tests below are for langauge
    def test_language_field_can_be_30_characters_long(self):
        self.language.language = 'x'*30
        self._assert_is_valid(self.language)
    
    def test_language_field_cannot_be_over_30_characters_long(self):
        self.language.language = 'x'*31
        self._assert_is_invalid(self.language)

    def test_spoken_proficiency_has_to_be_one_of_possible_inputs(self):
        self.language.spoken_proficiency='B'
        self._assert_is_valid(self.language)
        self.language.spoken_proficiency='I'
        self._assert_is_valid(self.language)
        self.language.spoken_proficiency='A'
        self._assert_is_valid(self.language)
        self.language.spoken_proficiency='F'
        self._assert_is_valid(self.language)
        self.language.spoken_proficiency='incorrect option' 
        self._assert_is_invalid(self.language)
    
    def test_language_proficiency_has_to_be_one_of_possible_inputs(self):
        self.language.written_proficiency='B'
        self._assert_is_valid(self.language)
        self.language.written_proficiency='I'
        self._assert_is_valid(self.language)
        self.language.written_proficiency='A'
        self._assert_is_valid(self.language)
        self.language.written_proficiency='F'
        self._assert_is_valid(self.language)
        self.language.written_proficiency='incorrect option'
        self._assert_is_invalid(self.language)

    def test_resume_field_for_language_must_be_resume(self):
        with self.assertRaises(ValueError):
            self.language.resume = ''
    
    #the tests below are for education
            
    def test_education_start_date_must_be_date_field(self):
        self.education.start_date = ''
        self._assert_is_invalid(self.education)
    
    def test_education_start_date_must_be_correct_format(self):
        #Django Date field must be in the format YYYY-MM-DD
        self.education.start_date = '01-01-1999'
        self._assert_is_invalid(self.education)
        self.education.start_date = '1999-01-01'
        self._assert_is_valid(self.education)
    
    def test_education_end_date_must_be_date_field(self):
        self.education.end_date = ''
        self._assert_is_invalid(self.education)
    
    def test_education_end_date_must_be_correct_format(self):
        #Django Date field must be in the format YYYY-MM-DD
        self.education.end_date = '01-01-2000'
        self._assert_is_invalid(self.education)
        self.education.end_date = '2000-01-01'
        self._assert_is_valid(self.education)

    def test_education_address_must_be_address_instance(self):
        with self.assertRaises(ValueError):
            self.education.address = ''
    
    def test_education_level_must_be_one_of_possible_options(self):
        self.education.level = 'HS'
        self._assert_is_valid(self.education)
        self.education.level = 'BA'
        self._assert_is_valid(self.education)
        self.education.level = 'MA'
        self._assert_is_valid(self.education)
        self.education.level= 'PHD'
        self._assert_is_valid(self.education)
        self.education.level= 'incorrect option'
        self._assert_is_invalid(self.education)

    def test_education_institution_can_be_100_characters(self):
        self.education.institution = 'x'*100
        self._assert_is_valid(self.education)
    
    def test_education_institution_cannot_be_over_100_characters(self):
        self.education.institution = 'x'*101
        self._assert_is_invalid(self.education)
    
    def test_education_grade_can_be_15_characters(self):
        self.education.grade = 'x'*15
        self._assert_is_valid(self.education)
    
    def test_education_grade_cannot_be_over_15_characters(self):
        self.education.grade = 'x'*16
        self._assert_is_invalid(self.education)
    
    def test_education_grade_cannot_be_over_blank(self):
        self.education.grade = ''
        self._assert_is_invalid(self.education)
    
    def test_resume_field_for_education_must_be_resume(self):
        with self.assertRaises(ValueError):
            self.education.resume = ''


    #the tests below are for resume
            
    def test_resume_github_can_be_blank(self):
        self.resume.github = ''
        self._assert_is_valid(self.resume)
    

    def test_resume_github_must_be_URL_field(self):
        self.resume.github = 'not_a_url'
        self._assert_is_invalid(self.resume)
        self.resume.github ='https://myurlfield.com/test'
        self._assert_is_valid(self.resume)
    
    def test_resume_linkedin_must_be_URL_field(self):
        self.resume.linkedin = 'not_a_url'
        self._assert_is_invalid(self.resume)
        self.resume.linkedin ='https://myurlfield.com/test'
        self._assert_is_valid(self.resume)
    
    def test_resume_about_can_be_2000_characters(self):
        self.resume.about = 'x'*2000
        self._assert_is_valid(self.resume)
    
    def test_resume_about_can_be_blank(self):
        self.resume.about = ''
        self._assert_is_valid(self.resume)
    
    def test_resume_experience_can_be_2000_characters(self):
        self.resume.experience = 'x'*2000
        self._assert_is_valid(self.resume)
    
    def test_resume_experience_can_be_blank(self):
        self.resume.experience = ''
        self._assert_is_valid(self.resume)

    
    
    


    def _assert_is_valid(self,input):
        try:
            input.full_clean()  
        except (ValidationError):
            self.fail(f"{input}should be valid")

    def _assert_is_invalid(self,input):
        with self.assertRaises(ValidationError):
            input.full_clean()   