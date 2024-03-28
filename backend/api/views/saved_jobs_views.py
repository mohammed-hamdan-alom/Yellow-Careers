from rest_framework import generics, mixins
from api.models import SavedJobs
from api.serializers.saved_jobs_serializer import SavedJobsSerializer
from django.shortcuts import get_object_or_404

class BaseSavedJobsView:
    '''Base view for the SavedJobs model.'''
    queryset = SavedJobs.objects.all()
    serializer_class = SavedJobsSerializer

class SavedJobsListView(BaseSavedJobsView, generics.ListAPIView):
    '''List all saved jobs.'''
    pass

class SavedJobsCreateView(BaseSavedJobsView, generics.CreateAPIView):
    '''Create a saved job.'''
    pass

class SavedJobsRetrieveView(BaseSavedJobsView, generics.RetrieveAPIView):
    '''Retrieve a saved job. The job seeker id and job id are passed as parameters in the url.'''
    pass

class SavedJobsUpdateView(BaseSavedJobsView, mixins.DestroyModelMixin, generics.RetrieveUpdateAPIView):
    '''Update a saved job. The job seeker id and job id are passed as parameters in the url.'''

    def get_object(self):
        job_seeker_id = self.kwargs.get('job_seeker_id')
        job_id = self.kwargs.get('job_id')
        return get_object_or_404(SavedJobs, job_seeker_id=job_seeker_id, job_id=job_id)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)