from django.test import TestCase
from django.core.exceptions import ValidationError
from api.models import Application, JobSeeker, Resume, Language, Education, SoftSkill, TechnicalSkill, ProfessionalExperience

class ApplicationModelTestCase(TestCase):
    '''Test case for the Application model'''

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
        self.application1 = Application.objects.get(pk=1)
        self.application2 = Application.objects.get(pk=2)
        self.application3 = Application.objects.get(pk=3)
    
    def test_valid_application(self):
        self._assert_application_is_valid()
    
    def test_jobseeker_cannot_be_null(self):
        self.application1.job_seeker = None
        self._assert_application_is_invalid()
    
    def test_resume_cannot_be_null(self):
        self.application1.resume = None
        self._assert_application_is_invalid()
    
    def test_job_cannot_be_null(self):
        self.application1.job = None
        self._assert_application_is_invalid()

    def test_if_job_seeker_is_deleted_application_is_deleted(self):
        self.application1.job_seeker.delete()
        with self.assertRaises(Application.DoesNotExist):
            Application.objects.get(pk=self.application1.pk)
    
    def test_if_resume_is_deleted_application_is_deleted(self):
        self.application1.resume.delete()
        with self.assertRaises(Application.DoesNotExist):
            Application.objects.get(pk=self.application1.pk)

    def test_if_job_is_deleted_application_is_deleted(self):
        self.application1.job.delete()
        with self.assertRaises(Application.DoesNotExist):
            Application.objects.get(pk=self.application1.pk)
    
    def test_if_application_is_deleted_job_is_not_deleted(self):
        self.application1.delete()
        self.assertTrue(self.application1.job)
    
    def test_if_application_is_deleted_job_seeker_is_not_deleted(self):
        job_seeker_id = self.application1.job_seeker.id
        self.application1.delete()
        with self.assertRaises(JobSeeker.DoesNotExist):
            JobSeeker.objects.get(id=job_seeker_id)
    
    def test_if_application_is_deleted_resume_is_deleted(self):
        resume_id = self.application1.resume.id
        self.application1.delete()
        with self.assertRaises(Resume.DoesNotExist):
            Resume.objects.get(id=resume_id)

    def test_jobseeker_and_job_must_be_unique_together(self):
        application = Application(job_seeker=self.application1.job_seeker, resume=self.application1.resume, job=self.application1.job)
        with self.assertRaises(ValidationError):
            application.full_clean()
    
    def test_create_application_method(self):
        resume = self.application2.resume
        application_count_before = Application.objects.count()
        language_count_before = Language.objects.count()
        education_count_before = Education.objects.count()
        soft_skill_count_before = SoftSkill.objects.count()
        technical_skill_count_before = TechnicalSkill.objects.count()
        professional_experience_count_before = ProfessionalExperience.objects.count()
        application = Application.objects.create(job_seeker=self.application2.job_seeker, resume=self.application2.resume, job=self.application1.job)
        self.assertEqual(Application.objects.count(), application_count_before + 1)
        self.assertEqual(Language.objects.count(), language_count_before + Language.objects.filter(resume_id=resume.id).count())
        self.assertEqual(Education.objects.count(), education_count_before + Education.objects.filter(resume_id=resume.id).count())
        self.assertEqual(SoftSkill.objects.count(), soft_skill_count_before + SoftSkill.objects.filter(resume_id=resume.id).count())
        self.assertEqual(TechnicalSkill.objects.count(), technical_skill_count_before + TechnicalSkill.objects.filter(resume_id=resume.id).count())
        self.assertEqual(ProfessionalExperience.objects.count(), professional_experience_count_before + ProfessionalExperience.objects.filter(resume_id=resume.id).count())
    
    def test_delete_application_method(self):
        application = Application.objects.create(job_seeker=self.application2.job_seeker, resume=self.application2.resume, job=self.application1.job)
        
        application_languages_count = Language.objects.filter(resume_id=application.resume.id).count()
        application_educations_count = Education.objects.filter(resume_id=application.resume.id).count()
        application_soft_skills_count = SoftSkill.objects.filter(resume_id=application.resume.id).count()
        application_technical_skills_count = TechnicalSkill.objects.filter(resume_id=application.resume.id).count()
        application_professional_experiences_count = ProfessionalExperience.objects.filter(resume_id=application.resume.id).count()

        application_count_before = Application.objects.count()
        language_count_before = Language.objects.count()
        education_count_before = Education.objects.count()
        soft_skill_count_before = SoftSkill.objects.count()
        technical_skill_count_before = TechnicalSkill.objects.count()
        professional_experience_count_before = ProfessionalExperience.objects.count()
        
        application.delete()
        
        self.assertEqual(Application.objects.count(), application_count_before - 1)
        self.assertEqual(Language.objects.count(), language_count_before - application_languages_count)
        self.assertEqual(Education.objects.count(), education_count_before - application_educations_count)
        self.assertEqual(SoftSkill.objects.count(), soft_skill_count_before - application_soft_skills_count)
        self.assertEqual(TechnicalSkill.objects.count(), technical_skill_count_before - application_technical_skills_count)
        self.assertEqual(ProfessionalExperience.objects.count(), professional_experience_count_before - application_professional_experiences_count)
    
    def _assert_application_is_valid(self):
        self.application1.full_clean()
        self.application2.full_clean()
        self.application3.full_clean()
    
    def _assert_application_is_invalid(self):
        with self.assertRaises(ValidationError):
            self.application2.full_clean()
            self.application3.full_clean()
            self.application1.full_clean()