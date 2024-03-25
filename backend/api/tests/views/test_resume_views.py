from django.test import TestCase
from api.models.resume import *
from api.models.company import *
from api.models.address import *
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIRequestFactory
from api.views.resume_views import EducationCreateView

#test application views fails
class ResumeViewTestCase(TestCase):

    fixtures = ["api/tests/fixtures/addresses.json",
                "api/tests/fixtures/answers.json",
                "api/tests/fixtures/applications.json",
                "api/tests/fixtures/companies.json",
                "api/tests/fixtures/employers.json",
                "api/tests/fixtures/jobs.json",
                "api/tests/fixtures/jobseekers.json",
                "api/tests/fixtures/questions.json",
                "api/tests/fixtures/resumes.json",
                "api/tests/fixtures/users.json",]
    
    def setUp(self):
        self.resumes = [Resume.objects.get(pk=1), 
                        Resume.objects.get(pk=2),]
        
    def test_get_all_resumes(self):
        response = self.client.get(reverse("resume-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.resumes))

    def test_get_resume(self):
        response = self.client.get(reverse("resume-get", args=[1]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], 1)

    def test_create_resume(self):
        resume_data = {
            "job_seeker" : 1,
            "github" : "https://github.com/username",
            "linkedin" : "https://linkedin.com/username",
            "experience" : "3 years",
            "about" : "I am a software engineer with 3 years experience",
        }

        response = self.client.post(reverse("resume-post"), resume_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Resume.objects.count(), len(self.resumes) + 1)

    def test_update_resume(self):
        resume = self.resumes[0]
        updated_resume_data = {
            "job_seeker" : 1,
            "github" : "https://github.com/username",
            "linkedin" : "https://linkedin.com/username",
            "experience" : "5 years",
            "about" : "I am a software engineer with 5 years experience",
        }
        response = self.client.put(reverse("resume-put", args=[resume.id]), updated_resume_data, content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        resume.refresh_from_db()
        self.assertEqual(resume.experience, updated_resume_data["experience"])
        self.assertEqual(resume.about, updated_resume_data["about"])

    
    def test_delete_resume(self):
        response = self.client.delete(reverse("resume-put", args=[1]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Resume.objects.count(), len(self.resumes) - 1)

class SoftSkillViewTestCase(TestCase):
    fixtures = ["api/tests/fixtures/addresses.json",
            "api/tests/fixtures/answers.json",
            "api/tests/fixtures/applications.json",
            "api/tests/fixtures/companies.json",
            "api/tests/fixtures/employers.json",
            "api/tests/fixtures/jobs.json",
            "api/tests/fixtures/jobseekers.json",
            "api/tests/fixtures/questions.json",
            "api/tests/fixtures/resumes.json",
            "api/tests/fixtures/users.json",]
    

    def setUp(self):
        self.resume = Resume.objects.get(pk=1)
        self.softskills = [SoftSkill.objects.get(resume=self.resume.id)],
    
    def test_get_all_softskills(self):
        response = self.client.get(reverse("resume-soft-skills-list", args=[self.resume.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.softskills))

    def test_create_softskill(self):
        before_count = SoftSkill.objects.count()
        softskill_data = {
            "resume" : self.resume.id,
            "skill" : "Teamwork",
        }
        response = self.client.post(reverse("resume-soft-skills-post", args=[self.resume.id]), softskill_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SoftSkill.objects.count(), before_count + 1)

    def test_update_softskill(self):
        softskill = self.softskills[0][0]
        softskill_id = softskill.id
        updated_softskill_data = {
            "resume" : self.resume.id,
            "skill" : "Teamwork",
        }
        response = self.client.put(reverse("resume-soft-skills-put", args=[self.resume.id, softskill_id]), updated_softskill_data, content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        softskill.refresh_from_db()
        self.assertEqual(softskill.skill, updated_softskill_data["skill"])
    
    def test_delete_softskill(self):
        before_count = SoftSkill.objects.count()
        softskill = self.softskills[0][0]
        response = self.client.delete(reverse("resume-soft-skills-put", args=[self.resume.id, softskill.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(SoftSkill.objects.count(), before_count - 1)
        
             
class TechnicalSkillViewTestCase(TestCase):
    fixtures = ["api/tests/fixtures/addresses.json",
            "api/tests/fixtures/answers.json",
            "api/tests/fixtures/applications.json",
            "api/tests/fixtures/companies.json",
            "api/tests/fixtures/employers.json",
            "api/tests/fixtures/jobs.json",
            "api/tests/fixtures/jobseekers.json",
            "api/tests/fixtures/questions.json",
            "api/tests/fixtures/resumes.json",
            "api/tests/fixtures/users.json",]

    def setUp(self):
        self.resume = Resume.objects.get(pk=1)
        self.technicalskills = [TechnicalSkill.objects.get(resume=self.resume.id)],

    def test_get_all_technicalskills(self):
        response = self.client.get(reverse("resume-technical-skills-list", args=[self.resume.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.technicalskills))
    
    def test_create_technicalskill(self):
        before_count = TechnicalSkill.objects.count()
        technicalskill_data = {
            "resume" : self.resume.id,
            "skill" : "Python",
        }
        response = self.client.post(reverse("resume-technical-skills-post", args=[self.resume.id]), technicalskill_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TechnicalSkill.objects.count(), before_count + 1)

    def test_update_technicalskill(self):
        technicalskill = self.technicalskills[0][0]
        technicalskill_id = technicalskill.id
        updated_technicalskill_data = {
            "resume" : self.resume.id,
            "skill" : "Python",
        }
        response = self.client.put(reverse("resume-technical-skills-put", args=[self.resume.id, technicalskill_id]), updated_technicalskill_data, content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        technicalskill.refresh_from_db()
        self.assertEqual(technicalskill.skill, updated_technicalskill_data["skill"])

    def test_delete_technicalskill(self):
        before_count = TechnicalSkill.objects.count()
        technicalskill = self.technicalskills[0][0]
        response = self.client.delete(reverse("resume-technical-skills-put", args=[self.resume.id, technicalskill.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(TechnicalSkill.objects.count(), before_count - 1)

    
class EducationViewTestCase(TestCase):
    fixtures = ["api/tests/fixtures/addresses.json",
            "api/tests/fixtures/answers.json",
            "api/tests/fixtures/applications.json",
            "api/tests/fixtures/companies.json",
            "api/tests/fixtures/employers.json",
            "api/tests/fixtures/jobs.json",
            "api/tests/fixtures/jobseekers.json",
            "api/tests/fixtures/questions.json",
            "api/tests/fixtures/resumes.json",
            "api/tests/fixtures/users.json",]
    
    def setUp(self):
        self.resume = Resume.objects.get(pk=1)
        self.educations = [Education.objects.get(resume=self.resume.id)],

    def test_get_all_educations(self):
        response = self.client.get(reverse("resume-education-list", args=[self.resume.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.educations))


    def test_delete_education(self):
        before_count = Education.objects.count()
        education = self.educations[0][0]
        response = self.client.delete(reverse("resume-educations-put", args=[self.resume.id, education.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Education.objects.count(), before_count - 1)

    def test_create_education(self):
        new_education_data = {
            "course_name": "COMPSCI",
            "start_date": "2022-01-01",
            "end_date": "2022-12-31",
            "address": {
                "city": "london",
                "post_code": "ew222",
                "country":"UK"
            },
            "level": "BA",
            "institution": "Test University",
            "grade": "A",
            "resume": self.resume.id
        }
        factory = APIRequestFactory()
        request = factory.post(reverse('resume-educations-post', args=[self.resume.id]), new_education_data, format='json')

        view = EducationCreateView.as_view()
        response = view(request, resume_id=self.resume.id)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["course_name"], new_education_data["course_name"])
        self.assertEqual(response.data["start_date"], new_education_data["start_date"])
        self.assertEqual(response.data["end_date"], new_education_data["end_date"])
        self.assertEqual(response.data["level"], new_education_data["level"])
        self.assertEqual(response.data["institution"], new_education_data["institution"])
        self.assertEqual(response.data["grade"], new_education_data["grade"])

        response_address = response.data["address"]
        expected_address = new_education_data["address"]
        self.assertEqual(response_address["city"], expected_address["city"])
        self.assertEqual(response_address["post_code"], expected_address["post_code"])
        self.assertEqual(response_address["country"], expected_address["country"])

    def test_create_invalid_address_education(self):
        before_count = Education.objects.count()
        invalid_education_data = {
            "course_name": "COMPSCI",
            "start_date": "2022-01-01",
            "end_date": "2022-12-31",
            "address": {
                "city": "12345",
                "post_code": "12345",
                "country":"12345"
            },
            "level": "BA",
            "institution": "Test University",
            "grade": "A",
            "resume": self.resume.id
        }
        
        factory = APIRequestFactory()
        request = factory.post(reverse('resume-educations-post', args=[self.resume.id]), invalid_education_data, format='json')
        view = EducationCreateView.as_view()
        response = view(request, resume_id=self.resume.id)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Education.objects.count(), before_count)

    
class ProfessionalExperienceViewTestCase(TestCase):
    fixtures = ["api/tests/fixtures/addresses.json",
        "api/tests/fixtures/answers.json",
        "api/tests/fixtures/applications.json",
        "api/tests/fixtures/companies.json",
        "api/tests/fixtures/employers.json",
        "api/tests/fixtures/jobs.json",
        "api/tests/fixtures/jobseekers.json",
        "api/tests/fixtures/questions.json",
        "api/tests/fixtures/resumes.json",
        "api/tests/fixtures/users.json",]

    def setUp(self):
        self.resume = Resume.objects.get(pk=1)
        self.professionalexperiences = [ProfessionalExperience.objects.get(resume=self.resume.id)],

    def test_get_all_professionalexperiences(self):
        response = self.client.get(reverse("resume-professional-experiences-list", args=[self.resume.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), len(self.professionalexperiences))

    
    def test_delete_professionalexperience(self):
        before_count = ProfessionalExperience.objects.count()
        professionalexperience = self.professionalexperiences[0][0]
        response = self.client.delete(reverse("resume-professional-experience-put", args=[self.resume.id, professionalexperience.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(ProfessionalExperience.objects.count(), before_count - 1)

    def test_get_application_resume(self):
        response = self.client.get(reverse("application-resume-get", args=[1]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], 1)

    def test_get_job_seeker_resume(self):
        response = self.client.get(reverse("job-seeker-resume", args=[1]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], 1)

    def test_get_resume_languages(self):
        response = self.client.get(reverse("resume-languages-list", args=[1]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_resume_language(self):
        before_count = Language.objects.count()
        language_data = {
            "resume" : 1,
            "language" : "English",
            "spoken_proficiency" : "F",
            "written_proficiency" : "F",
        }
        response = self.client.post(reverse("resume-languages-post", args=[1]), language_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Language.objects.count(), before_count + 1)