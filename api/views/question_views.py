from rest_framework import generics
from api.models import Job, Question
from api.serializers.question_serializer import QuestionSerializer


class BaseQuestionView:
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class QuestionListView(BaseQuestionView, generics.ListAPIView):

    def get_queryset(self):
        job_id = self.kwargs['pk']
        job = Job.objects.get(id=job_id)
        return Question.objects.filter(job=job)

class QuestionRetrieveView(BaseQuestionView, generics.RetrieveAPIView):
    pass

class QuestionCreateView(BaseQuestionView, generics.CreateAPIView):
    pass

class QuestionUpdateView(BaseQuestionView, generics.RetrieveUpdateDestroyAPIView):
    pass