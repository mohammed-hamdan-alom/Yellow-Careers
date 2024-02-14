from django.urls import path
from .views import hello_world_views, MyTokenObtainPairView, RegisterView, test_api_endpoint, JobCreationView, AddressCreationView
from api.views.job_list_view import JobListingView, AddressRetrieveView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('hello-world/', hello_world_views.hello_world, name='hello_world'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('dashboard/', test_api_endpoint, name="test"),
    path('jobs/create-job', JobCreationView.as_view(), name='create_job'),
    path('jobs/all-jobs', JobListingView.as_view(), name='all_jobs'),
    path('jobs/create-address', AddressCreationView.as_view(), name='create_address'),
    path('jobs/get-address/<int:pk>', AddressRetrieveView.as_view(), name='get_address'),
]
