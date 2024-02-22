from rest_framework.test import APITestCase, APIRequestFactory
from django.urls import reverse
from api.views.job_views import JobCreationView
from rest_framework import status
from api.models import Job, Address 
from api.serializers import JobSerializer

class JobsCreationTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = JobCreationView.as_view()
        self.url = reverse("create_job")
        self.address = Address.objects.create(
            city = "London",
            post_code = "E10 VTD",
            country = "England"
        )

        self.address.save() #save() allows reference to fk

        self.job_data = {
            "title" : "TestJob",
            "description" : "TestDescription",
            "salary" : 7000,
            "job_type" : "FT",
            "address" : 1
        }

    def test_job_create_rejects_GET(self):
        request = self.factory.get(self.url)
        response = self.view(request)
        self.assertEquals(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_job_created_correctly(self):
        request = self.factory.post(self.url, self.job_data, format="json")
        response = self.view(request)

        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(response.data["title"], self.job_data["title"])
        self.assertEquals(response.data["description"], self.job_data["description"])
        self.assertEquals(response.data["salary"], self.job_data["salary"])
        self.assertEquals(response.data["job_type"], self.job_data["job_type"])
        self.assertEquals(response.data["address"], self.job_data["address"])

    def test_job_saved(self):
        request = self.factory.post(self.url, self.job_data, format="json")
        response = self.view(request)

        self.assertEquals(Job.objects.count(), 1)

    def test_job_can__be_created_without_address(self):
        self.job_data["address"] = None
        request = self.factory.post(self.url, self.job_data, format="json")
        response = self.view(request)

        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(response.data["address"], None)

    def test_job_can_be_created_without_salary(self):
        self.job_data["salary"] = None
        request = self.factory.post(self.url, self.job_data, format="json")
        response = self.view(request)

        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(response.data["salary"], None)



