from rest_framework import generics
from api.models import Answer
from api.serializers.answer_serializer import AnswerSerializer


class BaseAnswerView:
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

class AnswerListView(BaseAnswerView, generics.ListAPIView):
    pass


class AnswerCreateView(BaseAnswerView, generics.CreateAPIView):
    pass

class AnswerUpdateView(BaseAnswerView, generics.RetrieveUpdateDestroyAPIView):
    pass