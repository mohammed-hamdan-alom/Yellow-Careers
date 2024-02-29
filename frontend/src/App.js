import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min";

// import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import LandingPage from "./components/landing_page/LandingPage";
import LoginPage from "./components/login/LoginPage";
import JobSeekerRegister from "./components/register/jobseeker_register/JobSeekerRegister";
import EmployerRegister from "./components/register/employer_register/EmployerRegister";

import DashBoardPage from "./components/job-seeker/dashboard/DashBoardPage";
import JobSeekerLayout from "./components/job-seeker/layout/JobSeekerLayout";
import SearchPage from "./components/job-seeker/search/SearchPage";
import JobSeekerProfile from './components/job-seeker/profile/JobSeekerProfile'
import ResumePage from "./components/job-seeker/resume/ResumePage";
import JobDetails from "./components/job-seeker/job_details/JobDetails";
import JobQuestions from "./components/job-seeker/job_details/JobQuestions";
import AppliedJobListPage from "./components/job-seeker/job_list/AppliedJobsListPage";
import SavedJobListPage from "./components/job-seeker/job_list/SavedJobsListPage";
import AppliedJobDetails from "./components/job-seeker/job_details/AppliedJobDetails";

import JobCreation from "./components/employer/job_creation/JobCreation";
import EmployerLayout from "./components/employer/layout/EmployerLayout";
import EmployerDashBoardPage from "./components/employer/dashboard/EmployerDashBoardPage";

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
        </Route>
        {/* <PrivateRoute component={Dashboard} path='/dashboard'/> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;