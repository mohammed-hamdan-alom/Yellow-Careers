from rest_framework import generics, mixins
from api.models import SavedJobs
from api.serializers.saved_jobs_serializer import SavedJobsSerializer
from django.shortcuts import get_object_or_404

class BaseSavedJobsView:
    queryset = SavedJobs.objects.all()
    serializer_class = SavedJobsSerializer

class SavedJobsListView(BaseSavedJobsView, generics.ListAPIView):
    pass

class SavedJobsCreateView(BaseSavedJobsView, generics.CreateAPIView):
    pass

class SavedJobsUpdateView(BaseSavedJobsView, mixins.DestroyModelMixin, generics.RetrieveUpdateAPIView):

    def get_object(self):
        job_seeker_id = self.kwargs.get('job_seeker_id')
        job_id = self.kwargs.get('job_id')
        return get_object_or_404(SavedJobs, job_seeker_id=job_seeker_id, job_id=job_id)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)