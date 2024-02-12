from django.urls import path
from .views import hello_world_views, MyTokenObtainPairView, EmployerRegisterView, JobSeekerRegisterView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('hello-world/', hello_world_views.hello_world, name='hello_world'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('employer-register/', EmployerRegisterView.as_view(), name='auth_employer_register'),
    path('jobseeker-register/', JobSeekerRegisterView.as_view(), name='auth_jobseeker_register')
]