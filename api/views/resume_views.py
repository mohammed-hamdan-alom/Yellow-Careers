from rest_framework import generics
from api.models import Resume, SoftSkill
from api.serializers.resume_serializer import *


class BaseResumeView:
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

class ResumeListView(BaseResumeView, generics.ListAPIView):
    pass

class ResumeRetrieveView(BaseResumeView, generics.RetrieveAPIView):
    pass

class ResumeCreateView(BaseResumeView, generics.CreateAPIView):
    pass

class ResumeUpdateView(BaseResumeView, generics.RetrieveUpdateDestroyAPIView):
    pass

class ResumeSoftSkillListView(BaseResumeView, generics.ListAPIView):
    serializer_class = ResumeSoftSkillSerializer
    def get_queryset(self):
        """
        This view returns a list of all the soft skills
        for the resume as determined by the resume_id portion of the URL.
        """
        resume_id = self.kwargs['resume_id']
        return SoftSkill.objects.filter(resume=resume_id)

class ResumeSoftSkillCreateView(BaseResumeView, generics.CreateAPIView):
    serializer_class = ResumeSoftSkillSerializer
    def perform_create(self, serializer):
        resume_id = self.kwargs['resume_id']
        serializer.save(resume_id=resume_id)

class ResumeSoftSkillUpdateView(BaseResumeView,generics.RetrieveUpdateDestroyAPIView):
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
    serializer_class = ResumeTechnicalSkillSerializer
    def perform_create(self, serializer):
        resume_id = self.kwargs['resume_id']
        serializer.save(resume_id=resume_id)

class ResumeTechnicalSkillUpdateView(BaseResumeView,generics.RetrieveUpdateDestroyAPIView):
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
    serializer_class = ResumeLanguageSerializer
    def perform_create(self, serializer):
        resume_id = self.kwargs['resume_id']
        serializer.save(resume_id=resume_id)

class ResumeLanguageUpdateView(BaseResumeView,generics.RetrieveUpdateDestroyAPIView):
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
    serializer_class = EducationSerializer
    def perform_create(self, serializer):
        resume_id = self.kwargs['resume_id']
        serializer.save(resume_id=resume_id)

class EducationUpdateView(BaseResumeView,generics.RetrieveUpdateDestroyAPIView):
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
    serializer_class = ProfessionalExperienceSerializer
    def perform_create(self, serializer):
        resume_id = self.kwargs['resume_id']
        serializer.save(resume_id=resume_id)

class ProfessionalExperienceUpdateView(BaseResumeView,generics.RetrieveUpdateDestroyAPIView):
    queryset = ProfessionalExperience.objects.all()
    serializer_class = ProfessionalExperienceSerializer
    lookup_url_kwarg = 'pk'