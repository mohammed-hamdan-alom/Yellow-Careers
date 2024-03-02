import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min";

// import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import LandingPage from "./components/public/landing_page/LandingPage";
import LoginPage from "./components/public/login/LoginPage";
import JobSeekerRegister from "./components/public/register/jobseeker_register/JobSeekerRegister";
import EmployerRegister from "./components/public/register/employer_register/EmployerRegister";

import DashBoardPage from "./components/job_seeker/dashboard/DashBoardPage";
import JobSeekerLayout from "./components/job_seeker/layout/JobSeekerLayout";
import SearchPage from "./components/job_seeker/search/SearchPage";
import JobSeekerProfile from './components/job_seeker/profile/JobSeekerProfile'
import ResumePage from "./components/job_seeker/resume/ResumePage";
import JobDetails from "./components/job_seeker/job_details/JobDetails";
import JobQuestions from "./components/job_seeker/job_details/JobQuestions";
import AppliedJobListPage from "./components/job_seeker/job_list/AppliedJobsListPage";
import SavedJobListPage from "./components/job_seeker/job_list/SavedJobsListPage";
import AppliedJobDetails from "./components/job_seeker/job_details/AppliedJobDetails";

import JobCreation from "./components/employer/job_creation/JobCreation";
import EmployerLayout from "./components/employer/layout/EmployerLayout";
import EmployerDashBoardPage from "./components/employer/dashboard/EmployerDashBoardPage";
import CompanyProfilePage from "./components/employer/company_profile/CompanyProfilePage";
import CompanyEditProfilePage from "./components/employer/company_profile/CompanyEditProfilePage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register/employer" element={<EmployerRegister />} />
        <Route path="/register/jobseeker" element={<JobSeekerRegister />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/job-seeker/*" element={<JobSeekerLayout />}>
          <Route path="dashboard" element={<DashBoardPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="saved-jobs" element={<SavedJobListPage />} />
          <Route path="profile" element={<JobSeekerProfile />} />
          <Route path="job-details/:jobId" element={<JobDetails />} />
          <Route path="job-details/:jobId/questions" element={<JobQuestions />} />
          <Route path="job-details/:jobId/application" element={<AppliedJobDetails />} />
          <Route path="applied-jobs" element={<AppliedJobListPage />} />
        </Route>
        <Route path="/employer/*" element={<EmployerLayout />}>
          <Route path="dashboard" element={<EmployerDashBoardPage />} />
          <Route path="create-job" element={<JobCreation />} />
          <Route path="company" element = {<CompanyProfilePage />} />
          <Route path="company/edit" element={<CompanyEditProfilePage />} />
        </Route>
        {/* <PrivateRoute component={Dashboard} path='/dashboard'/> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
