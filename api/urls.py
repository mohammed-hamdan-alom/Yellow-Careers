from django.urls import path
from .views import hello_world_views, jobs_creation_view
urlpatterns = [
    path('hello-world/', hello_world_views.hello_world, name='hello_world'),
    path('jobs/create-job', jobs_creation_view.job_create, name='create_job'),
    path('jobs/all-jobs', jobs_creation_view.job_list, name='all_jobs'),
]
