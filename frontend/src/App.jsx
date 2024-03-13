import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import LandingPage from "./components/LandingPage/LandingPage";

import LoginPage from "./features/authentication/login/LoginPage";
import AuthLayout from "./features/authentication/AuthLayout";
import EmployerRegister from "./features/authentication/register/employer/EmployerRegister";
import JobSeekerRegister from "./features/authentication/register/job-seeker/JobSeekerRegister";

import JobSeekerLayout from "./features/jobseeker/layouts/JobSeekerLayout";
import DashBoardPage from "./features/jobseeker/dashboard/Dashboard";
import SearchPage from "./features/jobseeker/search/SearchPage";
import JobSeekerProfile from "./features/jobseeker/profile/JobSeekerProfile";
import ResumePage from './features/jobseeker/resume/ResumePage'
import JobDetails from "./features/jobseeker/job-details/job-datails/JobDetails";
import JobQuestions from "./features/jobseeker/job-details/job-questions/JobQuestions";
import AppliedJobListPage from "./features/jobseeker/job-list/applied-jobs/AppliedJobsListPage";
import SavedJobListPage from "./features/jobseeker/job-list/saved-jobs/SavedJobsListPage";
import AppliedJobDetails from "./features/jobseeker/job-details/applied-job-details/AppliedJobDetails";

import JobApplicantsPage from "./features/employer/job_applicants/JobApplicants";
import JobCreation from "@/features/employer/job_creation/JobCreation"
import EmployerLayout from "./features/employer/layout/EmployerLayout";
import EmployerDashBoardPage from "./features/employer/dashboard/EmployerDashBoardPage";
import ApplicationDetails from "./features/employer/application_details/ApplicationDetails";
import CompanyProfilePage from "./features/employer/company_profile/CompanyProfilePage";

import JobDetailsEmployer from "./features/employer/job_applicants/JobDetailsEmployer";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

function App() {

  return (
    <AuthProvider>
      <Routes>

        <Route path="/" element={<LandingPage />} />

        <Route path="/auth/*" element={<AuthLayout/>}>
          <Route path="login" element={<LoginPage/>} />
          <Route path="register-employer" element={<EmployerRegister />} />
          <Route path="register-jobseeker" element={<JobSeekerRegister />} />
        </Route>

        <Route element={<PrivateRoute role={['job_seeker']}/>}>
        <Route path="/job-seeker/*" element={<JobSeekerLayout />}>
          <Route path="dashboard" element={<DashBoardPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="saved-jobs" element={<SavedJobListPage />} />
          <Route path="profile" element={<JobSeekerProfile />} />
          <Route path="job-details/:jobId" element={<JobDetails />} />
          <Route path="job-details/:jobId/questions" element={<JobQuestions />} />
          <Route path="application-details/:applicationId" element={<AppliedJobDetails />} /> 
          <Route path="applied-jobs" element={<AppliedJobListPage />} />
        </Route>
        </Route>
        
        <Route element={<PrivateRoute role={['employer']}/>}>
        <Route path="/employer/*" element={<EmployerLayout />}>
          <Route path="dashboard" element={<EmployerDashBoardPage />} />
          <Route path="create-job" element={<JobCreation />} />
          <Route path="job-applicants/:jobId" element={<JobApplicantsPage />} />  
          <Route path="job-details/:jobId" element={<JobDetailsEmployer />} />
          <Route path="application-details/:applicationId" element={<ApplicationDetails />} />
          <Route path="company" element = {<CompanyProfilePage />} />
        </Route>
        </Route>
        
      </Routes>
    </AuthProvider>
  )
}

export default App
