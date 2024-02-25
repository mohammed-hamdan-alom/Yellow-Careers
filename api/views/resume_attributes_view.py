from rest_framework import generics
from api.models import SoftSkill, TechnicalSkill, Education
from api.serializers import SoftSkillSerializer, TechnicalSkillSerializer, EducationSerializer
from django.shortcuts import get_object_or_404

class BaseAttributeView:
    lookup_field = 'resume_id'

class SoftSkillListView(BaseAttributeView, generics.ListAPIView):
    queryset = SoftSkill.objects.all()
    serializer_class = SoftSkillSerializer

    def get_queryset(self):
        resume_id = self.kwargs.get('resume_id')
        return SoftSkill.objects.filter(resume_id = resume_id)

class TechnicalSkillListView(BaseAttributeView, generics.ListAPIView):
    queryset = TechnicalSkill.objects.all()
    serializer_class = TechnicalSkillSerializer

    def get_queryset(self):
        resume_id = self.kwargs.get('resume_id')
        return TechnicalSkill.objects.filter(resume_id = resume_id)

class EducationListView(BaseAttributeView, generics.ListAPIView):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer

    def get_queryset(self):
        resume_id = self.kwargs.get('resume_id')
        return Education.objects.filter(resume_id = resume_id)


