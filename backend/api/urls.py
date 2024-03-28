from django.urls import path

from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('employer-register/', EmployerRegisterView.as_view(), name='auth_employer_register'),
    path('jobseeker-register/', JobSeekerRegisterView.as_view(), name='auth_jobseeker_register'),


    path('jobs/create-job', JobCreationView.as_view(), name='create_job'),
    path('jobs/all-jobs', JobListingView.as_view(), name='all_jobs'),
    path('jobs/<int:pk>/', JobRetrieveView.as_view(), name='get_job'),
    path('jobs/<int:pk>/questions/', JobQuestionListView.as_view(), name='job-question-list'),
    path('jobs/<int:pk>/address/', AddressRetrieveJobView.as_view(), name='job-address'),
    path('jobs/<int:pk>/company/', JobCompanyRetrieveView.as_view(), name='job-company'),
    path('jobs/<int:pk>/update-archive/', JobUpdateArchiveView.as_view(), name='update-job-archive'),

    path('addresses/', AddressListView.as_view(), name='address-list'),
    path('addresses/<int:pk>/', AddressRetrieveView.as_view(), name='address-get'),
    path('addresses/create/', AddressCreateView.as_view(), name='address-post'),
    path('addresses/<int:pk>/update/', AddressUpdateView.as_view(), name='address-put'),

    path('answers/create/', AnswerCreateView.as_view(), name='answer-post'),
    path('answers/<int:pk>/update/', AnswerUpdateView.as_view(), name='answer-put'),
    path('answers/', AnswerListView.as_view(), name='answer-list'),

    path('applications/', ApplicationListView.as_view(), name='application-list'),
    path('applications/<int:pk>/', ApplicationRetrieveView.as_view(), name='application-get'),
    path('applications/create/', ApplicationCreateView.as_view(), name='application-post'),
    path('applications/<int:pk>/update/', ApplicationUpdateView.as_view(), name='application-put'),
    path('applications/<int:job_seeker_id>/<int:job_id>/', JobSeekerApplicationRetrieveView.as_view(), name='job-seeker-application-get'),
    path('applications/<int:application_id>/resume/', ApplicationResumeRetrieveView.as_view(), name='application-resume-get'),
    path('applications/<int:application_id>/answers/', ApplicationAnswerListView.as_view(), name='application-answer-list'),
    path('applications/job/<int:job_id>/', ApplicationsFromJobListView.as_view(), name="application-all-get"),

    path('companies/', CompanyListView.as_view(), name='company-list'),
    path('companies/<int:pk>/', CompanyRetrieveView.as_view(), name='company-get'),
    path('companies/create/', CompanyCreateView.as_view(), name='company-post'),
    path('companies/<int:pk>/update/', CompanyUpdateView.as_view(), name='company-put'),
    path('companies/<int:pk>/employers/', CompanyEmployerListView.as_view(), name='company-employers-list'),

    path('employer-job-relations/', EmployerJobRelationListView.as_view(), name='employer-job-relation-list'),
    path('employer-job-relations/<int:pk>/', EmployerJobRelationRetrieveView.as_view(), name='employer-job-relation-get'),
    path('employer-job-relations/create/', EmployerJobRelationCreateView.as_view(), name='employer-job-relation-post'),
    path('employer-job-relations/<int:pk>/update/', EmployerJobRelationUpdateView.as_view(), name='employer-job-relation-put'),
    path('employer-job-relations/delete/<int:job_id>/<int:employer_id>/', EmployerJobRelationDestroyView.as_view(), name='employer-job-relation-delete'),

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
    path('resumes/<int:resume_id>/soft-skills/update/<int:pk>', ResumeSoftSkillUpdateView.as_view(), name='resume-soft-skills-put'),

    path('resumes/<int:resume_id>/technical-skills/', ResumeTechnicalSkillListView.as_view(), name='resume-technical-skills-list'),
    path('resumes/<int:resume_id>/technical-skills/create/', ResumeTechnicalSkillCreateView.as_view(), name='resume-technical-skills-post'),
    path('resumes/<int:resume_id>/technical-skills/update/<int:pk>', ResumeTechnicalSkillUpdateView.as_view(), name='resume-technical-skills-put'),

    path('resumes/<int:resume_id>/educations/', EducationListView.as_view(), name='resume-education-list'),
    path('resumes/<int:resume_id>/educations/create/', EducationCreateView.as_view(), name='resume-educations-post'),
    path('resumes/<int:resume_id>/educations/update/<int:pk>', EducationUpdateView.as_view(), name='resume-educations-put'),

    path('resumes/<int:resume_id>/professional-experiences/', ProfessionalExperienceListView.as_view(), name='resume-professional-experiences-list'),
    path('resumes/<int:resume_id>/professional-experiences/create/', ProfessionalExperienceCreateView.as_view(), name='resume-professional-experiences-post'),
    path('resumes/<int:resume_id>/professional-experiences/update/<int:pk>', ProfessionalExperienceUpdateView.as_view(), name='resume-professional-experience-put'),

    path('resumes/<int:resume_id>/languages/', ResumeLanguageListView.as_view(), name='resume-languages-list'),
    path('resumes/<int:resume_id>/languages/create/', ResumeLanguageCreateView.as_view(), name='resume-languages-post'),
    path('resumes/<int:resume_id>/languages/update/<int:pk>', ResumeLanguageUpdateView.as_view(), name='resume-languages-put'),

    path('job-seekers/', JobSeekerListView.as_view(), name='job-seeker-list'),
    path('job-seekers/<int:pk>/', JobSeekerRetrieveView.as_view(), name='job-seeker-get'),
    path('job-seekers/create/', JobSeekerCreateView.as_view(), name='job-seeker-post'),
    path('job-seekers/<int:pk>/update/', JobSeekerUpdateView.as_view(), name='job-seeker-put'),
    path('job-seeker/<int:pk>/resume/', UserResumeRetrieveView.as_view(), name='job-seeker-resume'),
    path('job-seeker/<int:pk>/applied-jobs/', JobsAppliedListView.as_view(), name='job-seeker-applications'),
    path('job-seeker/<int:pk>/saved-jobs/', JobSeekerSavedJobsListView.as_view(), name='job-seeker-saved-jobs'),
    path('job-seeker/<int:pk>/matched-jobs/', JobSeekerMatchedJobsListingView.as_view(), name='job-seeker-matched-jobs'),
    path('job-seeker/application/<int:application_id>/', JobSeekerFromApplicationRetrieveView.as_view(), name='job-seeker-from-application-get'),
    path('job-seeker/change-password/', ChangePasswordView.as_view(), name='job-seeker-change-password'),

    path('saved-jobs/', SavedJobsListView.as_view(), name='saved-jobs-list'),
    path('saved-jobs/create/', SavedJobsCreateView.as_view(), name='saved-jobs-create'),
    path('saved-jobs/<int:pk>/', SavedJobsRetrieveView.as_view(), name='saved-jobs-get'),
    path('saved-jobs/update/<int:job_seeker_id>/<int:job_id>/', SavedJobsUpdateView.as_view(), name='saved-jobs-update'),

    path('employers/', EmployerListView.as_view(), name='employer-list'),
    path('employers/<int:pk>/', EmployerRetrieveView.as_view(), name='employer-get'),
    path('employers/create/', EmployerCreateView.as_view(), name='employer-post'),
    path('employers/<int:pk>/update/', EmployerUpdateView.as_view(), name='employer-put'),
    path('job/<int:pk>/employers/', LinkedEmployersView.as_view(), name='get-job-employers'),
    path('employers/company/<int:user_id>/', CompanyEmployersView.as_view(), name='employers-from-company'),
    
    path('employer/<int:pk>/company-jobs/active/', AdminActiveJobListingView.as_view(), name='view-admin-active-jobs'),
    path('employer/<int:pk>/jobs/active/', EmployerActiveJobListingView.as_view(), name='view-employer-active-jobs'),
    path('employer/<int:pk>/jobs/archived/', EmployerArchivedJobListingView.as_view(), name='view-employer-archived-jobs'),
    path('employer/<int:pk>/company-jobs/archived/', AdminArchivedJobListingView.as_view(), name='view-admin-archived-jobs'),
    path('employer/change-password/', ChangePasswordView.as_view(), name='employer-change-password'),

    path('invited-employer/create/', InvitedEmployerCreateView.as_view(), name='invited-employer-create'),
    path('invited-employer/get/', InvitedEmployerRetrieveByEmailView.as_view(), name='invited-employer-get'),
    path('invited-employer/delete/', InvitedEmployerDeleteByEmailView.as_view(), name='invited-employer-delete'),
    ]
