"""Unit tests for the Resume model."""
from django.core.exceptions import ValidationError
from django.test import TestCase
from api.models import Resume
from api.models import SoftSkill
from api.models import TechnicalSkill
from api.models import Language
from api.models import Education
from api.models import ProfessionalExperience
from api.models import User
from api.models import JobSeeker
from api.models import Employer

class ResumeModelTestCase(TestCase):

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
        self.soft_skill2 = SoftSkill.objects.get(pk=2)

        self.technical_skill = TechnicalSkill.objects.get(pk=1)
        self.technical_skill2 = TechnicalSkill.objects.get(pk=2)

        self.language = Language.objects.get(pk=1)
        self.language2 = Language.objects.get(pk=2)

        self.education = Education.objects.get(pk=1)
        self.education2 = Education.objects.get(pk=2)

        self.professional_experience = ProfessionalExperience.objects.get(pk=1)
        self.professional_experience2 = ProfessionalExperience.objects.get(pk=2)

        self.resume = Resume.objects.get(pk=1)
        self.jobseeker = JobSeeker.objects.get(user_ptr_id=1)


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

    def test_soft_skill_to_string(self):
        self.assertEqual(self.soft_skill.to_string(),self.soft_skill.skill)
        self.assertEqual(self.soft_skill2.to_string(),self.soft_skill2.skill)

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

    def test_technical_skill_to_string(self):
        self.assertEqual(self.technical_skill.to_string(),self.technical_skill.skill)
        self.assertEqual(self.technical_skill2.to_string(),self.technical_skill2.skill)

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

    def test_language_to_string(self):
        self.assertEqual(self.language.to_string(),self.language.language)
        self.assertEqual(self.language2.to_string(),self.language2.language)
    
    #the tests below are for education
        
    def test_education_course_name_can_be_50_characters(self):
        self.education.course_name = 'x'*50
        self._assert_is_valid(self.education)
    
    def test_education_course_name_cannot_be_over_50_characters(self):
        self.education.course_name = 'x'*51
        self._assert_is_invalid(self.education)   

    def test_education_course_name_cannot_be_blank(self):
        self.education.course_name = ''
        self._assert_is_invalid(self.education)   
            
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
    
    def test_education_grade_cannot_be_blank(self):
        self.education.grade = ''
        self._assert_is_invalid(self.education)
    
    def test_resume_field_for_education_must_be_resume(self):
        with self.assertRaises(ValueError):
            self.education.resume = ''

    def test_education_to_string(self):
       self.assertEqual(self.education.to_string(),self.education.course_name)
       self.assertEqual(self.education2.to_string(),self.education2.course_name)

    #the tests below are for professional experience
            
    def test_professional_experience_start_date_cannot_be_blank(self):
        self.professional_experience.start_date = ''
        self._assert_is_invalid(self.professional_experience)
    
    def test_professional_experience_end_date_cannot_be_blank(self):
        self.professional_experience.end_date = ''
        self._assert_is_invalid(self.professional_experience)
    
    def test_professional_experience_start_date_must_be_correct_format(self):
        #Django Date field must be in the format YYYY-MM-DD
        self.professional_experience.start_date = '01-01-1999'
        self._assert_is_invalid(self.professional_experience)
        self.professional_experience.start_date = '1999-01-01'
        self._assert_is_valid(self.professional_experience)
    
    def test_professional_experience_end_date_must_be_correct_format(self):
        #Django Date field must be in the format YYYY-MM-DD
        self.professional_experience.end_date = '01-01-2000'
        self._assert_is_invalid(self.professional_experience)
        self.professional_experience.end_date = '2000-01-01'
        self._assert_is_valid(self.professional_experience)

    def test_professional_experience_address_must_be_address_instance(self):
        with self.assertRaises(ValueError):
            self.professional_experience.address = ''

    def test_professional_experience_company_can_be_100_characters(self):
        self.professional_experience.company = 'x'*100
        self._assert_is_valid(self.professional_experience)

    def test_professional_experience_company_cannot_be_over_100_characters(self):
        self.professional_experience.company = 'x'*101
        self._assert_is_invalid(self.professional_experience)

    def test_professional_experience_position_can_be_100_characters(self):
        self.professional_experience.position = 'x'*100
        self._assert_is_valid(self.professional_experience)

    def test_professional_experience_position_cannot_be_over_100_characters(self):
        self.professional_experience.position = 'x'*101
        self._assert_is_invalid(self.professional_experience)

    def test_professional_experience_description_can_be_2000_characters(self):
        self.professional_experience.description = 'x'*2000
        self._assert_is_valid(self.professional_experience)

    def test_professional_experience_description_can_be_blank(self):
        self.professional_experience.description =  ''
        self._assert_is_valid(self.professional_experience)
    
    def test_resume_field_for_professional_experience_must_be_resume(self):
        with self.assertRaises(ValueError):
            self.professional_experience.resume = ''

    def test_professional_experience_to_string(self):
        self.assertEqual(self.professional_experience.to_string(),f"{self.professional_experience.position} {self.professional_experience.description}")
        self.assertEqual(self.professional_experience2.to_string(),f"{self.professional_experience2.position} {self.professional_experience2.description}")

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
    
    def test_get_job_seeker(self):
        retrieved_jobseeker = self.resume.get_jobseeker()
        self.assertTrue(retrieved_jobseeker,self.jobseeker)

    def test_get_education(self):
        retrieved_education = self.resume.get_education()
        self.assertIn(self.education,retrieved_education)
        self.education2.resume = self.resume
        self.education2.save()
        retrieved_education2 = self.resume.get_education()
        self.assertIn(self.education,retrieved_education2)
        self.assertIn(self.education2,retrieved_education2)
    
    def test_get_technical_skills(self):
        retrieved_technical_skills = self.resume.get_technical_skills()
        self.assertIn(self.technical_skill,retrieved_technical_skills)
        self.technical_skill2.resume = self.resume
        self.technical_skill2.save()
        retrieved_technical_skills2 = self.resume.get_technical_skills()
        self.assertIn(self.technical_skill,retrieved_technical_skills2)
        self.assertIn(self.technical_skill2,retrieved_technical_skills2)
    
    def test_get_soft_skills(self):
        retrieved_soft_skills = self.resume.get_soft_skills()
        self.assertIn(self.soft_skill,retrieved_soft_skills)
        self.soft_skill2.resume = self.resume
        self.soft_skill2.save()
        retrieved_soft_skills2 = self.resume.get_soft_skills()
        self.assertIn(self.soft_skill,retrieved_soft_skills2)
        self.assertIn(self.soft_skill2,retrieved_soft_skills2)

    def test_get_languages(self):
        retrieved_languages = self.resume.get_languages()
        self.assertIn(self.language,retrieved_languages)
        self.language2.resume = self.resume
        self.language2.save()
        retrieved_languages2 = self.resume.get_languages()
        self.assertIn(self.language,retrieved_languages2)
        self.assertIn(self.language2,retrieved_languages2)

    def test_get_professional_experience(self):
        retrieved_professional_experience = self.resume.get_professional_experience()
        self.assertIn(self.professional_experience,retrieved_professional_experience)
        self.professional_experience2.resume = self.resume
        self.professional_experience2.save()
        retrieved_professional_experience2 = self.resume.get_professional_experience()
        self.assertIn(self.professional_experience,retrieved_professional_experience2)
        self.assertIn(self.professional_experience2,retrieved_professional_experience2)
    
    def test_resume_to_string(self):
        education_strings = [education.to_string() for education in self.resume.get_education()]
        skills_strings = [skills.to_string() for skills in self.resume.get_technical_skills()] + [skills.to_string() for skills in self.resume.get_soft_skills()]
        language_strings = [language.to_string() for language in self.resume.get_languages()]
        experience_strings = [experience.to_string() for experience in self.resume.get_professional_experience()]
        self.assertEqual(self.resume.to_string(),' '.join(education_strings + skills_strings + language_strings + experience_strings + [self.resume.about,self.resume.experience]))


    def _assert_is_valid(self,input):
        input.full_clean()  


    def _assert_is_invalid(self,input):
        with self.assertRaises(ValidationError):
            input.full_clean()   