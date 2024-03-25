from rest_framework.response import Response
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404

from api.models import Job, Application, JobSeeker, SavedJobs, Employer, EmployerJobRelation

from api.serializers.job_serializer import JobSerializer

from api.matchmaker.matchmaker import *

from Levenshtein import ratio
from rest_framework.exceptions import PermissionDenied

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

	def get_object(self):
		job = super().get_object()
		user = self.request.user

		if hasattr(user, 'jobseeker'):
			return job
		elif hasattr(user,'employer'):
			employer = Employer.objects.get(user_ptr_id=user.id)
			employer_ids = EmployerJobRelation.objects.filter(job_id=job.id).values_list('employer', flat=True)
			job_company = Employer.objects.get(id=employer_ids[0]).company
			if not employer.company == job_company:
				raise PermissionDenied("You do not have permission to view this job.")
			if employer.is_company_admin:
				return job
			if employer.id in employer_ids:
				return job
			raise PermissionDenied("You do not have permission to view this job.")

		else:
			raise PermissionDenied("You do not have permission to view this job.")
	
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
        # Convert the list of jobs to a set to remove duplicates
        return list(set(relation.job for relation in relations))