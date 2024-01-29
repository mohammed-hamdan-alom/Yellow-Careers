from django.forms import ValidationError
from django.test import TestCase
from api.models import Resume, SoftSkill, TechnicalSkill, Education, Language,Address

class SoftSkillModelTestCase(TestCase):
    """Unit tests for the SoftSkill model."""

    def setUp(self):
        self.soft_skill = SoftSkill.objects.create(skill='Teamwork')

    def test_valid_soft_skill(self):
        """Test that the test soft skill is valid."""
        self._assert_soft_skill_is_valid()

    def test_skill_cannot_be_blank(self):
        """Test that the skill cannot be blank."""
        self.soft_skill.skill = ''
        self._assert_soft_skill_is_invalid()

    def test_skill_cannot_be_more_than_30_characters(self):
        """Test that the skill cannot be too long."""
        self.soft_skill.skill = 'a' * 31
        self._assert_soft_skill_is_invalid()

    def _assert_soft_skill_is_valid(self):
        try:
            self.soft_skill.full_clean()
        except (ValidationError):
            self.fail('Test SoftSkill should be valid')

    def _assert_soft_skill_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.soft_skill.full_clean()

class TechnicalSkillModelTestCase(TestCase):
    """Unit tests for the TechnicalSkill model."""

    def setUp(self):
        self.technical_skill = TechnicalSkill.objects.create(skill='Python')

    def test_valid_technical_skill(self):
        """Test that the test technical skill is valid."""
        self._assert_technical_skill_is_valid()

    def test_skill_cannot_be_blank(self):
        """Test that the skill cannot be blank."""
        self.technical_skill.skill = ''
        self._assert_technical_skill_is_invalid()

    def test_skill_cannot_be_more_than_30_characters(self):
        """Test that the skill cannot be too long."""
        self.technical_skill.skill = 'a' * 31
        self._assert_technical_skill_is_invalid()

    def _assert_technical_skill_is_valid(self):
        try:
            self.technical_skill.full_clean()
        except (ValidationError):
            self.fail('Test TechnicalSkill should be valid')

    def _assert_technical_skill_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.technical_skill.full_clean()

class LanguageModelTestCase(TestCase):

    def setUp(self):
        self.language = Language.objects.create(language='English', spoken_proficiency='F', written_proficiency='F')
    
    def test_valid_language(self):
        """Test that the test language is valid."""
        self._assert_language_is_valid()
    
    def test_language_cannot_be_blank(self):
        """Test that the language cannot be blank."""
        self.language.language = ''
        self._assert_language_is_invalid()
    
    def test_language_cannot_be_more_than_30_characters(self):
        """Test that the language cannot be too long."""
        self.language.language = 'a' * 31
        self._assert_language_is_invalid()
    
    def test_spoken_proficiency_cannot_be_blank(self):
        """Test that the spoken proficiency cannot be blank."""
        self.language.spoken_proficiency = ''
        self._assert_language_is_invalid()
    
    def test_written_proficiency_cannot_be_blank(self):
        """Test that the written proficiency cannot be blank."""
        self.language.written_proficiency = ''
        self._assert_language_is_invalid()
    
    def _assert_language_is_valid(self):
        try:
            self.language.full_clean()
        except (ValidationError):
            self.fail('Test Language should be valid')
    
    def _assert_language_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.language.full_clean()

class EducationModelTestCase(TestCase):
    """Unit tests for the Education model."""

    def setUp(self):
        self.address = Address.objects.create(country='United Kingdom', city='Test City', post_code='12345')
        self.education = Education.objects.create(start_date='2022-01-01', end_date='2022-12-31', institution='Test University', grade='A',address=self.address, level='HS')

    def test_valid_education(self):
        """Test that the test education is valid."""
        self._assert_education_is_valid()

    def test_start_date_cannot_be_blank(self):
        """Test that the start date cannot be blank."""
        self.education.start_date = ''
        self._assert_education_is_invalid()

    def test_end_date_cannot_be_blank(self):
        """Test that the end date cannot be blank."""
        self.education.end_date = ''
        self._assert_education_is_invalid()

    def test_institution_cannot_be_blank(self):
        """Test that the institution cannot be blank."""
        self.education.institution = ''
        self._assert_education_is_invalid()

    def test_grade_cannot_be_blank(self):
        """Test that the grade cannot be blank."""
        self.education.grade = ''
        self._assert_education_is_invalid()

    def test_level_cannot_be_blank(self):
        """Test that the level cannot be blank."""
        self.education.level = ''
        self._assert_education_is_invalid()

    def test_start_date_cannot_be_in_the_future(self):
        """Test that the start date cannot be in the future."""
        self.education.start_date = '2023-01-01T00:00:00Z'
        self._assert_education_is_invalid()

    def test_end_date_cannot_be_before_start_date(self):
        """Test that the end date cannot be before the start date."""
        self.education.end_date = '2021-01-01T00:00:00Z'
        self._assert_education_is_invalid()

    def test_institution_cannot_be_more_than_100_characters(self):
        """Test that the institution cannot be too long."""
        self.education.institution = 'a' * 101
        self._assert_education_is_invalid()

    def test_grade_cannot_be_more_than_15_characters(self):
        """Test that the grade cannot be too long."""
        self.education.grade = 'a' * 16
        self._assert_education_is_invalid()
    
    def test_level_cannot_be_more_than_15_characters(self):
        """Test that the level cannot be too long."""
        self.education.level = 'a' * 16
        self._assert_education_is_invalid()
    
    def _assert_education_is_valid(self):
        try:
            self.education.full_clean()
        except (ValidationError):
            self.fail('Test Education should be valid') 
    
    def _assert_education_is_invalid(self): 
        with self.assertRaises(ValidationError):
            self.education.full_clean() 

class ResumeModelTestCase(TestCase):
    """Unit tests for the Resume model."""

    def setUp(self):
        self.soft_skill = SoftSkill.objects.create(skill='Teamwork')
        self.technical_skill = TechnicalSkill.objects.create(skill='Python')
        self.address = Address.objects.create(country='United Kingdom', city='Test City', post_code='12345')
        self.education = Education.objects.create(start_date='2022-01-01', end_date='2022-12-31', institution='Test University', grade='A',address=self.address)
        self.language = Language.objects.create(language='English', spoken_proficiency='F', written_proficiency='F')
        self.resume = Resume.objects.create(github='https://github.com/test', linkedin='https://linkedin.com/in/test')
        self.resume.soft_skills.add(self.soft_skill)
        self.resume.technical_skills.add(self.technical_skill)
        self.resume.education.add(self.education)
        self.resume.language.add(self.language)

    def test_valid_resume(self):
        """Test that the test resume is valid."""
        self._assert_resume_is_valid()

    def test_github_can_be_blank(self):
        """Test that the github URL can be blank."""
        self.resume.github = ''
        self._assert_resume_is_valid()

    def test_linkedin_can_be_blank(self):
        """Test that the linkedin URL can be blank."""
        self.resume.linkedin = ''
        self._assert_resume_is_valid()
    
    def test_soft_skills_can_be_blank(self):
        """Test that the soft skills can be blank."""
        self.resume.soft_skills.clear()
        self._assert_resume_is_valid()
    
    def test_technical_skills_can_be_blank(self):
        """Test that the technical skills can be blank."""
        self.resume.technical_skills.clear()
        self._assert_resume_is_valid()
    
    def test_education_can_be_blank(self):
        """Test that the education can be blank."""
        self.resume.education.clear()
        self._assert_resume_is_valid()
    
    def test_language_can_be_blank(self):
        """Test that the language can be blank."""
        self.resume.language.clear()
        self._assert_resume_is_valid()
    
    def test_github_cannot_be_invalid_url(self):
        """Test that the github URL cannot be invalid."""
        self.resume.github = 'invalid'
        self._assert_resume_is_invalid()

    def test_linkedin_cannot_be_invalid_url(self):
        """Test that the linkedin URL cannot be invalid."""
        self.resume.linkedin = 'invalid'
        self._assert_resume_is_invalid()
    
    def test_github_cannot_be_more_than_250_characters(self):
        """Test that the github URL cannot be too long."""
        self.resume.github = 'https://github.com/' + 'a' * 250
        self._assert_resume_is_invalid()

    def test_linkedin_cannot_be_more_than_250_characters(self):
        """Test that the linkedin URL cannot be too long."""
        self.resume.linkedin = 'https://linkedin.com/in/' + 'a' * 250
        self._assert_resume_is_invalid()

    def test_can_have_multiple_soft_skills(self):
        """Test that the resume can have multiple soft skills."""
        self.resume.soft_skills.add(SoftSkill.objects.create(skill='Communication'))
        self._assert_resume_is_valid()
    
    def test_can_have_multiple_technical_skills(self):
        """Test that the resume can have multiple technical skills."""
        self.resume.technical_skills.add(TechnicalSkill.objects.create(skill='Java'))
        self._assert_resume_is_valid()
    
    def test_can_have_multiple_educations(self):
        """Test that the resume can have multiple education."""
        self.resume.education.add(Education.objects.create(start_date='2022-01-01', end_date='2022-12-31', institution='Test University', grade='A',address=self.address))
        self._assert_resume_is_valid()

    def test_can_have_multiple_languages(self):
        """Test that the resume can have multiple language."""
        self.resume.language.add(Language.objects.create(language='French', spoken_proficiency='F', written_proficiency='F'))
        self._assert_resume_is_valid()


    def _assert_resume_is_valid(self):
        try:
            self.resume.full_clean()
        except (ValidationError):
            self.fail('Test Resume should be valid')

    def _assert_resume_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.resume.full_clean()