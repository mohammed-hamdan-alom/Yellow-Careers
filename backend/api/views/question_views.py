from rest_framework import generics
from api.models import Job, Question
from api.serializers.question_serializer import QuestionSerializer


class BaseQuestionView:
    '''Base view for the Question model. Contains the queryset and serializer_class attributes.'''
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class JobQuestionListView(BaseQuestionView, generics.ListAPIView):
    '''Retrieve all the questions of a job. The job id is passed as a parameter in the url.'''
    def get_queryset(self):
        job_id = self.kwargs['pk']
        job = Job.objects.get(id=job_id)
        return Question.objects.filter(job=job)
    
class QuestionListView(BaseQuestionView, generics.ListAPIView):
    '''List all questions.'''
    pass

class QuestionRetrieveView(BaseQuestionView, generics.RetrieveAPIView):
    '''Retrieve a question. The question id is passed as a parameter in the url.'''
    pass

class QuestionCreateView(BaseQuestionView, generics.CreateAPIView):
    '''Create a question.'''
    pass

class QuestionUpdateView(BaseQuestionView, generics.RetrieveUpdateDestroyAPIView):
    '''Update a question. The question id is passed as a parameter in the url.'''
    pass