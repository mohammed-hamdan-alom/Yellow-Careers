from rest_framework.test import APITestCase, APIRequestFactory
from django.urls import reverse
from api.views import JobListingView
from rest_framework import status
from api.models import Job, Address 
from api.serializers import JobSerializer

class JobsListTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = JobListingView.as_view()
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
            address = self.address_one
        )
        self.job_two = Job.objects.create(
            title = "TestJob2",
            description = "TestDescription2",
            salary = 7000,
            job_type = "FT",
            address = self.address_two
        )
        self.job_one.save()
        self.job_two.save()

    def test_job_list_GET_is_valid(self):
        request = self.factory.get(self.url)
        response = self.view(request)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
        self.assertEquals(response.data[0]['title'], "TestJob")
        self.assertEquals(response.data[1]['title'], "TestJob2")