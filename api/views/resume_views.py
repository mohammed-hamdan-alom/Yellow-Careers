from rest_framework import generics
from api.models import Resume, SoftSkill
from api.serializers.resume_serializer import ResumeSerializer, ResumeSoftSkillsSerializer


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

class ResumeSoftSkillsListView(BaseResumeView, generics.ListAPIView):
    serializer_class = ResumeSoftSkillsSerializer
    def get_queryset(self):
        """
        This view should return a list of all the soft skills
        for the resume as determined by the resume_id portion of the URL.
        """
        resume_id = self.kwargs['resume_id']
        return SoftSkill.objects.filter(resume=resume_id)

class ResumeSoftSkillsCreateView(BaseResumeView, generics.CreateAPIView):
    serializer_class = ResumeSoftSkillsSerializer
    def perform_create(self, serializer):
        resume_id = self.kwargs['resume_id']
        serializer.save(resume_id=resume_id)