from rest_framework.test import APITestCase, APIRequestFactory
from django.urls import reverse
from api.views import job_create, job_list
from rest_framework import status
from api.models import Job, Address 
from api.serializers import JobSerializer

class JobsCreationTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = job_create
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
            "location" : 1
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
        self.assertEquals(response.data["location"], self.job_data["location"])
    
    def test_job_can__be_created_without_address(self):
        self.job_data.pop('location', None)
        request = self.factory.post(self.url, self.job_data, format="json")
        response = self.view(request)

        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(response.data["location"], None)

    def test_job_can_be_created_without_salary(self):
        self.job_data.pop('salary', None)
        request = self.factory.post(self.url, self.job_data, format="json")
        response = self.view(request)

        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        self.assertEquals(response.data["salary"], None)

class JobsListTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = job_list
        self.url = reverse("all_jobs")
        self.address_one = Address.objects.create(
            city = "London",
            post_code = "E10 VTD",
            country = "England"
        )
        self.address_two = Address.objects.create(
            city = "London",
            post_code = "E11 VTD",
            country = "England"
        )

        self.address_one.save() #save() allows reference to fk
        self.address_two.save()

        self.job_one = Job.objects.create(
            title = "TestJob",
            description = "TestDescription",
            salary = 7000,
            job_type = "FT",
            location = self.address_one
        )
        self.job_two = Job.objects.create(
            title = "TestJob2",
            description = "TestDescription2",
            salary = 7000,
            job_type = "FT",
            location = self.address_two
        )
        self.job_one.save()
        self.job_two.save()

    def test_job_list_GET_is_valid(self):
        request = self.factory.get(self.url)
        response = self.view(request)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(response.data[0]['title'], "TestJob")
        self.assertEquals(response.data[1]['title'], "TestJob2")



