from rest_framework import generics
from api.models import Answer, Question, Application
from api.serializers.answer_serializer import AnswerSerializer
from django.shortcuts import get_object_or_404


class BaseAnswerView:
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

class AnswerListView(BaseAnswerView, generics.ListAPIView):
    pass


class AnswerCreateView(BaseAnswerView, generics.CreateAPIView):
    pass

class AnswerUpdateView(BaseAnswerView, generics.RetrieveUpdateDestroyAPIView):
    pass

class ApplicationAnswerListView(BaseAnswerView, generics.ListAPIView):
    '''Retrieve all the answers of an application. The application id is passed as a parameter in the url.'''
    def get_queryset(self):
        application_id = self.kwargs['application_id']
        application = get_object_or_404(Application, id=application_id)
        job_id = application.job.id
        questions = Question.objects.filter(job=job_id)
        question_ids = [question.id for question in questions]
        return Answer.objects.filter(question__in=question_ids, application=application_id)