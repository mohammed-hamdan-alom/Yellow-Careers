from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404

from api.models import Job, Application, JobSeeker, SavedJobs, Employer, EmployerJobRelation

from api.serializers.job_serializer import JobSerializer

from api.matchmaker.matchmaker import *

from Levenshtein import ratio

class JobCreationView(generics.CreateAPIView):
	'''Create a job.'''
	queryset = Job.objects.all()
	permission_classes = ([AllowAny])
	serializer_class = JobSerializer

class JobsAppliedListView(generics.ListAPIView):
	'''Retrieve the job of an application for a user. The job seekers id is passed as a parameter in the url.'''
	serializer_class = JobSerializer

	def get_queryset(self):
		job_seeker_id = self.kwargs['pk']
		job_seeker = get_object_or_404(JobSeeker, id=job_seeker_id)
		applications = Application.objects.filter(job_seeker=job_seeker)
		return [application.job for application in applications]
	
class JobSeekerMatchedJobsListingView(generics.ListAPIView):
	'''Retrieve the job of an application for a user. The job seekers id is passed as a parameter in the url.'''
	serializer_class = JobSerializer

	def get_queryset(self):
		job_seeker_id = self.kwargs['pk']
		job_seeker = get_object_or_404(JobSeeker, id=job_seeker_id)
		return getMatchedJobsForJobSeeker(job_seeker)
	
class JobSeekerSavedJobsListView(generics.ListAPIView):
	'''Get the jobs saved by a job seeker. The job seeker id is passed as a parameter in the url.'''
	queryset = Job.objects.all()
	serializer_class = JobSerializer

	def get_queryset(self):
		job_seeker_id = self.kwargs['pk']
		job_seeker = get_object_or_404(JobSeeker, id=job_seeker_id)
		saved_jobs = SavedJobs.objects.filter(job_seeker_id=job_seeker_id)
		return Job.objects.filter(savedjobs__in=saved_jobs)
        

class JobListingView(generics.ListAPIView):
	'''List all jobs.'''
	queryset = Job.objects.all()
	permission_classes = ([AllowAny])
	serializer_class = JobSerializer
    
class JobRetrieveView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

class EmployerJobListingView(generics.ListAPIView):
	'''Retrieve the jobs of an employer. The employer id is passed as a parameter in the URL.'''
	permission_classes = [AllowAny]
	serializer_class = JobSerializer

	def get_queryset(self):
		employer_id = self.kwargs.get('pk')
		employer = get_object_or_404(Employer, id=employer_id)
		relations = EmployerJobRelation.objects.filter(employer=employer)
		return [relation.job for relation in relations]

class AdminJobListingView(generics.ListAPIView):
	'''Retrieve the jobs of an admin. The employer id is passed as a parameter in the URL.'''
	permission_classes = [AllowAny]
	serializer_class = JobSerializer

	def get_queryset(self):
		employer_id = self.kwargs.get('pk')
		employer = get_object_or_404(Employer, id=employer_id)
		relations = []
		if employer.is_company_admin:
			relations = EmployerJobRelation.objects.filter(employer__company=employer.company)
		return [relation.job for relation in relations]