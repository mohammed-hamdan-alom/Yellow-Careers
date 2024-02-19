from django.urls import path
from .views import *
from api.views.job_list_view import JobListingView, AddressRetrieveView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('hello-world/', hello_world_views.hello_world, name='hello_world'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('dashboard/', test_api_endpoint, name="test"),
    path('jobs/create-job', JobCreationView.as_view(), name='create_job'),
    path('jobs/all-jobs', JobListingView.as_view(), name='all_jobs'),
    path('jobs/get-address/<int:pk>', AddressRetrieveView.as_view(), name='get_address'),

    path('addresses/', AddressListView.as_view(), name='address-list'),
    path('addresses/<int:pk>/', AddressRetrieveView.as_view(), name='address-get'),
    path('addresses/create/', AddressCreateView.as_view(), name='address-post'),
    path('addresses/<int:pk>/update/', AddressUpdateView.as_view(), name='address-put'),

    path('answers/', AnswerListView.as_view(), name='answer-list'),
    #need to make a url for getting answers for a specific question
    path('answers/create/', AnswerCreateView.as_view(), name='answer-post'),
    path('answers/<int:pk>/update/', AnswerUpdateView.as_view(), name='answer-put'),

    path('applications/', ApplicationListView.as_view(), name='application-list'),
    path('applications/<int:pk>/', ApplicationRetrieveView.as_view(), name='application-get'),
    path('applications/create/', ApplicationCreateView.as_view(), name='application-post'),
    path('applications/<int:pk>/update/', ApplicationUpdateView.as_view(), name='application-put'),

    path('companies/', CompanyListView.as_view(), name='company-list'),
    path('companies/<int:pk>/', CompanyRetrieveView.as_view(), name='company-get'),
    path('companies/create/', CompanyCreateView.as_view(), name='company-post'),
    path('companies/<int:pk>/update/', CompanyUpdateView.as_view(), name='company-put'),

    path('employer-job-relations/', EmployerJobRelationListView.as_view(), name='employer-job-relation-list'),
    path('employer-job-relations/<int:pk>/', EmployerJobRelationRetrieveView.as_view(), name='employer-job-relation-get'),
    path('employer-job-relations/create/', EmployerJobRelationCreateView.as_view(), name='employer-job-relation-post'),
    path('employer-job-relations/<int:pk>/update/', EmployerJobRelationUpdateView.as_view(), name='employer-job-relation-put'),

    path('questions/', QuestionListView.as_view(), name='question-list'),
    path('questions/<int:pk>/', QuestionRetrieveView.as_view(), name='question-get'),
    path('questions/create/', QuestionCreateView.as_view(), name='question-post'),
    path('questions/<int:pk>/update/', QuestionUpdateView.as_view(), name='question-put'),

    path('resumes/', ResumeListView.as_view(), name='resume-list'),
    path('resumes/<int:pk>/', ResumeRetrieveView.as_view(), name='resume-get'),
    path('resumes/create/', ResumeCreateView.as_view(), name='resume-post'),
    path('resumes/<int:pk>/update/', ResumeUpdateView.as_view(), name='resume-put'),

    path('resumes/<int:resume_id>/soft-skills/', ResumeSoftSkillListView.as_view(), name='resume-soft-skills-list'),
    path('resumes/<int:resume_id>/soft-skills/create/', ResumeSoftSkillCreateView.as_view(), name='resume-soft-skills-post'),
    
    path('resumes/<int:resume_id>/languages/', ResumeLanguageListView.as_view(), name='resume-languages-list'),
    path('resumes/<int:resume_id>/languages/create/', ResumeLanguageCreateView.as_view(), name='resume-languages-post'),
    path('job-seekers/', JobSeekerListView.as_view(), name='job-seeker-list'),
    path('job-seekers/<int:pk>/', JobSeekerRetrieveView.as_view(), name='job-seeker-get'),
    path('job-seekers/create/', JobSeekerCreateView.as_view(), name='job0seeker-post'),
    path('job-seekers/<int:pk>/update/', JobSeekerUpdateView.as_view(), name='job-seeker-put'),

    path('employers/', EmployerListView.as_view(), name='employer-list'),
    path('employers/<int:pk>/', EmployerRetrieveView.as_view(), name='employer-get'),
    path('employers/create/', EmployerCreateView.as_view(), name='employer-post'),
    path('employers/<int:pk>/update/', EmployerUpdateView.as_view(), name='employer-put'),
]
