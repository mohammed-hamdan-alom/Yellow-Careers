from django.urls import path
from .views import hello_world_views

urlpatterns = [
    path('hello-world/', hello_world_views.hello_world, name='hello_world'),
]