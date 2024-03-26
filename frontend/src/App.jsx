import { Routes, Route } from "react-router-dom";

import LandingPage from "./components/LandingPage/LandingPage";

import LoginPage from "./features/authentication/Login/LoginPage";
import AuthLayout from "./features/authentication/AuthLayout";
import GetStarted from "./features/authentication/GetStarted/GetStarted";
import JoinOrCreateCompany from "./features/authentication/Register/employer/JoinOrCreateCompany";
import CreateCompany from "./features/authentication/Register/employer/CreateCompany";
import InvitedEmployerVerification from "./features/authentication/Register/employer/InvitedEmployerVerification";
import EmployerRegister from "./features/authentication/Register/employer/EmployerRegister";
import JobSeekerRegister from "./features/authentication/Register/job-seeker/JobSeekerRegister";

import JobSeekerLayout from "./features/job-seeker/Layout/JobSeekerLayout";
import DashBoardPage from "./features/job-seeker/Dashboard/Dashboard";
import JobSeekerProfile from "./features/job-seeker/Profile/JobSeekerProfile";
import ResumePage from "./features/job-seeker/Resume/ResumePage";
import JobDetails from "./features/job-seeker/JobDetails/JobDetailsPage/JobDetailsPage";
import JobQuestions from "./features/job-seeker/JobDetails/JobQuestions/JobQuestions";
import AppliedJobListPage from "./features/job-seeker/JobList/AppliedJobs/AppliedJobsListPage";
import SavedJobListPage from "./features/job-seeker/JobList/SavedJobs/SavedJobsListPage";
import AppliedJobDetails from "./features/job-seeker/JobDetails/AppliedJobDetails/AppliedJobDetails";

import EmployerLayout from "./features/employer/Layout/EmployerLayout";
import JobApplicantsPage from "./features/employer/JobApplicants/JobApplicants";
import JobCreation from "./features/employer/JobCreation/JobCreation";
import QuestionCreation from "./features/employer/JobCreation/QuestionCreation";
import EmployerDashBoardPage from "./features/employer/Dashboard/EmployerDashBoardPage";
import ApplicationDetails from "./features/employer/ApplicationDetails/ApplicationDetails";
import CompanyProfilePage from "./features/employer/CompanyProfile/CompanyProfilePage";
import EmployerProfile from "./features/employer/Profile/EmployerProfile";
import JobDetailsEmployer from "./features/employer/JobApplicants/JobDetailsEmployer";

import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/auth/*" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="get-started" element={<GetStarted />} />
        <Route path="join-or-create-company" element={<JoinOrCreateCompany />} />
        <Route path="verify-invited-employer" element={<InvitedEmployerVerification />} />
        <Route path="create-company" element={<CreateCompany />} />
        <Route path="register-employer" element={<EmployerRegister />} />
        <Route path="register-employer/:companyId" element={<EmployerRegister />} />
        <Route path="register-jobseeker" element={<JobSeekerRegister />} />
      </Route>

      <Route element={<PrivateRoute role={["job_seeker"]} />}>
        <Route path="/job-seeker/*" element={<JobSeekerLayout />}>
          <Route path="dashboard" element={<DashBoardPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="saved-jobs" element={<SavedJobListPage />} />
          <Route path="profile" element={<JobSeekerProfile />} />
          <Route path="job-details/:jobId" element={<JobDetails />} />
          <Route path="job-details/:jobId/questions" element={<JobQuestions />} />
          <Route path="application-details/:applicationId" element={<AppliedJobDetails />} />
          <Route path="applied-jobs" element={<AppliedJobListPage />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute role={["employer"]} />}>
        <Route path="/employer/*" element={<EmployerLayout />}>
          <Route path="dashboard" element={<EmployerDashBoardPage />} />
          <Route path="create-job" element={<JobCreation />} />
          <Route path="create-questions/:jobId" element={<QuestionCreation />} />
          <Route path="job-applicants/:jobId" element={<JobApplicantsPage />} />
          <Route path="job-details/:jobId" element={<JobDetailsEmployer />} />
          <Route path="application-details/:applicationId" element={<ApplicationDetails />} />
          <Route path="company" element={<CompanyProfilePage />} />
          <Route path="profile" element={<EmployerProfile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
