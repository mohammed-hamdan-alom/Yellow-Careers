from django.urls import path
from .views import hello_world_views, MyTokenObtainPairView, RegisterView, dashboard
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('hello-world/', hello_world_views.hello_world, name='hello_world'),
    path('token/', MyTokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('register/', RegisterView.as_view()),
    path('dashboard/', dashboard)
]