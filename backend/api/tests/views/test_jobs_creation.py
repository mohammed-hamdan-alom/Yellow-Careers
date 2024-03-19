from rest_framework.test import APITestCase, APIRequestFactory
from django.urls import reverse
from api.views import JobCreationView
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
            "address" : {
                "city":"London",
                "post_code" : "E271i",
                "country":"England"
            }
        }

    def test_job_create_rejects_GET(self):
        request = self.factory.get(self.url)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_job_created_correctly(self):
        request = self.factory.post(self.url, self.job_data, format="json")
        response = self.view(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], self.job_data["title"])
        self.assertEqual(response.data["description"], self.job_data["description"])
        self.assertEqual(response.data["salary"], self.job_data["salary"])
        self.assertEqual(response.data["job_type"], self.job_data["job_type"])

        response_address = response.data["address"]
        expected_address = self.job_data["address"]
        self.assertEqual(response_address["city"], expected_address["city"])
        self.assertEqual(response_address["post_code"], expected_address["post_code"])
        self.assertEqual(response_address["country"], expected_address["country"])



    def test_job_saved(self):
        request = self.factory.post(self.url, self.job_data, format="json")
        response = self.view(request)

        self.assertEqual(Job.objects.count(), 1)

    def test_job_cannot__be_created_without_address(self):
        self.job_data["address"] = None
        request = self.factory.post(self.url, self.job_data, format="json")
        response = self.view(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_job_can_be_created_without_salary(self):
        self.job_data["salary"] = None
        request = self.factory.post(self.url, self.job_data, format="json")
        response = self.view(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["salary"], None)


