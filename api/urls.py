from django.urls import path
from .views import hello_world_views, MyTokenObtainPairView, RegisterView, test_api_endpoint, job_seeker_profile_views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('hello-world/', hello_world_views.hello_world, name='hello_world'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('dashboard/', test_api_endpoint, name="test"),
    path('job_seeker_update/<str:email>/', job_seeker_profile_views.job_seeker_update, name="job_seeker_update"),
]