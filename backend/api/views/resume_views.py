from rest_framework import generics
from api.models import Resume
from api.serializers.resume_serializer import ResumeSerializer
from django.shortcuts import get_object_or_404
from api.models import JobSeeker, Application, Resume, SoftSkill
from api.serializers.resume_serializer import *


class BaseResumeView:
    '''Base view for the Resume model.'''
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

class ResumeListView(BaseResumeView, generics.ListAPIView):
    '''List all resumes.'''
    pass

class ResumeRetrieveView(BaseResumeView, generics.RetrieveAPIView):
    '''Retrieve a resume. The resume id is passed as a parameter in the url.'''
    pass

class ApplicationResumeRetrieveView(BaseResumeView, generics.RetrieveAPIView):
    '''Retrieve the resume of an application. The application id is passed as a parameter in the url.'''
    def get_object(self):
        application_id = self.kwargs['application_id']
        application  = get_object_or_404(Application, id=application_id)
        return application.resume

class UserResumeRetrieveView(BaseResumeView, generics.RetrieveAPIView):
    '''Retrieve the resume of a job seeker. The job seeker id is passed as a parameter in the url.'''
    def get_object(self):
        job_seeker_id = self.kwargs['pk']
        job_seeker = get_object_or_404(JobSeeker, id=job_seeker_id)
        return job_seeker.resume
    
class ResumeCreateView(BaseResumeView, generics.CreateAPIView):
    '''Create a resume.'''
    pass

class ResumeUpdateView(BaseResumeView, generics.RetrieveUpdateDestroyAPIView):
    '''Update a resume. The resume id is passed as a parameter in the url.'''
    pass

class ResumeSoftSkillListView(BaseResumeView, generics.ListAPIView):
    '''List all soft skills.'''
    serializer_class = ResumeSoftSkillSerializer
    def get_queryset(self):
        """
        This view returns a list of all the soft skills
        for the resume as determined by the resume_id portion of the URL.
        """
        resume_id = self.kwargs['resume_id']
        return SoftSkill.objects.filter(resume=resume_id)

class ResumeSoftSkillCreateView(BaseResumeView, generics.CreateAPIView):
    '''Create a soft skill. The resume id is passed as a parameter in the URL.'''
    serializer_class = ResumeSoftSkillSerializer
    def perform_create(self, serializer):
        resume_id = self.kwargs['resume_id']
        serializer.save(resume_id=resume_id)

class ResumeSoftSkillUpdateView(BaseResumeView,generics.RetrieveUpdateDestroyAPIView):
    '''Update a soft skill. The soft skill id is passed as a parameter in the URL.'''
    queryset = SoftSkill.objects.all()
    serializer_class = ResumeSoftSkillSerializer
    lookup_url_kwarg = 'pk'
    

class ResumeTechnicalSkillListView(BaseResumeView, generics.ListAPIView):
    serializer_class = ResumeTechnicalSkillSerializer
    def get_queryset(self):
        """
        This view returns a list of all the soft skills
        for the resume as determined by the resume_id portion of the URL.
        """
        resume_id = self.kwargs['resume_id']
        return TechnicalSkill.objects.filter(resume=resume_id)

class ResumeTechnicalSkillCreateView(BaseResumeView, generics.CreateAPIView):
    '''Create a technical skill. The resume id is passed as a parameter in the URL.'''
    serializer_class = ResumeTechnicalSkillSerializer
    def perform_create(self, serializer):
        resume_id = self.kwargs['resume_id']
        serializer.save(resume_id=resume_id)

class ResumeTechnicalSkillUpdateView(BaseResumeView,generics.RetrieveUpdateDestroyAPIView):
    '''Update a technical skill. The technical skill id is passed as a parameter in the URL.'''
    queryset = TechnicalSkill.objects.all()
    serializer_class = ResumeTechnicalSkillSerializer
    lookup_url_kwarg = 'pk'

class ResumeLanguageListView(BaseResumeView, generics.ListAPIView):
    serializer_class = ResumeLanguageSerializer
    def get_queryset(self):
        """
        This view returns a list of all the languages
        for the resume as determined by the resume_id portion of the URL.
        """
        resume_id = self.kwargs['resume_id']
        return Language.objects.filter(resume=resume_id)

class ResumeLanguageCreateView(BaseResumeView, generics.CreateAPIView):
    '''Create a language. The resume id is passed as a parameter in the URL.'''
    serializer_class = ResumeLanguageSerializer
    def perform_create(self, serializer):
        resume_id = self.kwargs['resume_id']
        serializer.save(resume_id=resume_id)

class ResumeLanguageUpdateView(BaseResumeView,generics.RetrieveUpdateDestroyAPIView):
    '''Update a language. The language id is passed as a parameter in the URL.'''
    queryset = Language.objects.all()
    serializer_class = ResumeLanguageSerializer
    lookup_url_kwarg = 'pk'

class EducationListView(BaseResumeView, generics.ListAPIView):
    serializer_class = EducationSerializer
    def get_queryset(self):
        """
        This view returna a list of all the educations
        for the resume as determined by the resume_id portion of the URL.
        """
        resume_id = self.kwargs['resume_id']
        return Education.objects.filter(resume=resume_id)

class EducationCreateView(BaseResumeView, generics.CreateAPIView):
    '''Create an education. The resume id is passed as a parameter in the URL.'''
    serializer_class = EducationSerializer
    def perform_create(self, serializer):
        resume_id = self.kwargs['resume_id']
        serializer.save(resume_id=resume_id)

class EducationUpdateView(BaseResumeView,generics.RetrieveUpdateDestroyAPIView):
    '''Update an education. The education id is passed as a parameter in the URL.'''
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    lookup_url_kwarg = 'pk'


class ProfessionalExperienceListView(BaseResumeView, generics.ListAPIView):
    serializer_class = ProfessionalExperienceSerializer
    def get_queryset(self):
        """
        This view returns a list of the professional experience
        for the resume as determined by the resume_id portion of the URL.
        """
        resume_id = self.kwargs['resume_id']
        return ProfessionalExperience.objects.filter(resume=resume_id)

class ProfessionalExperienceCreateView(BaseResumeView, generics.CreateAPIView):
    '''Create a professional experience. The resume id is passed as a parameter in the URL.'''
    serializer_class = ProfessionalExperienceSerializer
    def perform_create(self, serializer):
        resume_id = self.kwargs['resume_id']
        serializer.save(resume_id=resume_id)

class ProfessionalExperienceUpdateView(BaseResumeView,generics.RetrieveUpdateDestroyAPIView):
    '''Update a professional experience. The professional experience id is passed as a parameter in the URL.'''
    queryset = ProfessionalExperience.objects.all()
    serializer_class = ProfessionalExperienceSerializer
    lookup_url_kwarg = 'pk'