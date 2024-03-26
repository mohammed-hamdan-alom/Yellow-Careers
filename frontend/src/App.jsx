import { Routes, Route } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import LandingPage from "./components/LandingPage/LandingPage";

import AuthLayout from "./features/authentication/AuthLayout";
import LoginPage from "./features/authentication/Login/LoginPage";
import GetStartedPage from "./features/authentication/GetStartedPage/GetStartedPage";
import JoinOrCreateCompanyPage from "./features/authentication/Register/employer/JoinOrCreateCompanyPage";
import CreateCompanyPage from "./features/authentication/Register/employer/CreateCompanyPage";
import InvitedEmployerVerificationPage from "./features/authentication/Register/employer/InvitedEmployerVerificationPage";
import EmployerRegisterPage from "./features/authentication/Register/employer/EmployerRegisterPage";
import JobSeekerRegister from "./features/authentication/Register/job-seeker/JobSeekerRegisterPage";

import JobSeekerLayout from "./features/job-seeker/Layout/JobSeekerLayout";
import DashBoardPage from "./features/job-seeker/Dashboard/JobSeekerDashboardPage";
import JobSeekerProfilePage from "./features/job-seeker/Profile/JobSeekerProfilePage";
import ResumePage from "./features/job-seeker/Resume/ResumePage";
import JobSeekerJobDetailsPage from "./features/job-seeker/JobDetails/JobSeekerJobDetailsPage";
import JobQuestionsPage from "./features/job-seeker/JobDetails/JobQuestionsPage";
import AppliedJobPage from "./features/job-seeker/JobLists/AppliedJobsPage";
import SavedJobPage from "./features/job-seeker/JobLists/SavedJobsPage";
import AppliedJobDetailsPage from "./features/job-seeker/JobDetails/AppliedJobDetailsPage";

import EmployerLayout from "./features/employer/Layout/EmployerLayout";
import JobApplicantsPage from "./features/employer/JobApplicants/JobApplicants";
import JobCreationPage from "./features/employer/JobCreation/JobCreationPage";
import QuestionCreationPage from "./features/employer/JobCreation/QuestionCreationPage";
import EmployerDashboardPage from "./features/employer/Dashboard/EmployerDashboardPage";
import ArchivedJobsListPage from "./features/employer/ArchivedJobs/ArchivedJobsListPage";
import ApplicationDetailsPage from "./features/employer/ApplicationDetails/ApplicationDetailsPage";
import CompanyProfilePage from "./features/employer/CompanyProfile/CompanyProfilePage";
import EmployerProfilePage from "./features/employer/Profile/EmployerProfilePage";
import EmployerJobDetailsPage from "./features/employer/JobApplicants/EmployerJobDetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/auth/*" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="get-started" element={<GetStartedPage />} />
        <Route path="join-or-create-company" element={<JoinOrCreateCompanyPage />} />
        <Route path="verify-invited-employer" element={<InvitedEmployerVerificationPage />} />
        <Route path="create-company" element={<CreateCompanyPage />} />
        <Route path="register-employer" element={<EmployerRegisterPage />} />
        <Route path="register-employer/:companyId" element={<EmployerRegisterPage />} />
        <Route path="register-jobseeker" element={<JobSeekerRegister />} />
      </Route>

      <Route element={<PrivateRoute role={["job_seeker"]} />}>
        <Route path="/job-seeker/*" element={<JobSeekerLayout />}>
          <Route path="dashboard" element={<DashBoardPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="saved-jobs" element={<SavedJobPage />} />
          <Route path="profile" element={<JobSeekerProfilePage />} />
          <Route path="job-details/:jobId" element={<JobSeekerJobDetailsPage />} />
          <Route path="job-details/:jobId/questions" element={<JobQuestionsPage />} />
          <Route path="application-details/:applicationId" element={<AppliedJobDetailsPage />} />
          <Route path="applied-jobs" element={<AppliedJobPage />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute role={["employer"]} />}>
        <Route path="/employer/*" element={<EmployerLayout />}>
          <Route path="dashboard" element={<EmployerDashboardPage />} />
          <Route path="archived-jobs" element={<ArchivedJobsListPage />} />
          <Route path="create-job" element={<JobCreationPage />} />
          <Route path="create-questions/:jobId" element={<QuestionCreationPage />} />
          <Route path="job-applicants/:jobId" element={<JobApplicantsPage />} />
          <Route path="job-details/:jobId" element={<EmployerJobDetailsPage />} />
          <Route path="application-details/:applicationId" element={<ApplicationDetailsPage />} />
          <Route path="company" element={<CompanyProfilePage />} />
          <Route path="profile" element={<EmployerProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
