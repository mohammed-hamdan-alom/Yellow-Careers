from rest_framework import generics
from api.models import SavedJobs
from api.serializers.saved_jobs_serializer import SavedJobsSerializer


class BaseSavedJobsView:
    queryset = SavedJobs.objects.all()
    serializer_class = SavedJobsSerializer

class SavedJobsListView(BaseSavedJobsView, generics.ListAPIView):
    pass

class SavedJobsRetrieveView(BaseSavedJobsView, generics.RetrieveAPIView):
    pass

class SavedJobsCreateView(BaseSavedJobsView, generics.CreateAPIView):
    pass

class SavedJobsUpdateView(BaseSavedJobsView, generics.RetrieveUpdateDestroyAPIView):
    pass