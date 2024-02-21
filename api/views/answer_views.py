from rest_framework import generics
from api.models import Answer, Question
from api.serializers.answer_serializer import AnswerSerializer
from django.shortcuts import get_object_or_404


class BaseAnswerView:
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

class AnswerListView(BaseAnswerView, generics.ListAPIView):
    def get_queryset(self):
        question_id = self.kwargs['question_id']
        question = get_object_or_404(Question, id=question_id)
        return Answer.objects.filter(question=question)


class AnswerCreateView(BaseAnswerView, generics.CreateAPIView):
    pass

class AnswerUpdateView(BaseAnswerView, generics.RetrieveUpdateDestroyAPIView):
    pass