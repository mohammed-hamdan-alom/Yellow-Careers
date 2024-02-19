from rest_framework import generics
from api.models import Question
from api.serializers.question_serializer import QuestionSerializer


class BaseQuestionView:
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class QuestionListView(BaseQuestionView, generics.ListAPIView):
    pass

class QuestionRetrieveView(BaseQuestionView, generics.RetrieveAPIView):
    pass

class QuestionCreateView(BaseQuestionView, generics.CreateAPIView):
    pass

class QuestionUpdateView(BaseQuestionView, generics.RetrieveUpdateDestroyAPIView):
    pass