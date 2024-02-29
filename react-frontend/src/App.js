import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/login/LoginPage";
import { AuthProvider } from './context/AuthContext';
import DashBoardPage from "./components/dashboard/DashBoardPage";
import JobSeekerLayout from "./components/layout/JobSeekerLayout";
import SearchPage from "./components/search/SearchPage";
import LandingPage from "./components/landing_page/LandingPage";
import UpdateJobSeekerProfile from './components/update_job_seeker_profile/UpdateJobSeekerProfile'
import EmployerRegister from "./components/register/employer_register/EmployerRegister";
import JobCreation from "./components/job_creation/JobCreation";
import JobListPage from "./components/job_list/JobListPage";
// import PrivateRoute from './utils/PrivateRoute';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ProfilePage from "./components/profile/ProfilePage";
import ResumePage from "./components/resume/ResumePage";
import JobDetails from "./components/job_details/JobDetails";
import JobQuestions from "./components/job_details/JobQuestions";
import JobSeekerRegister from "./components/register/jobseeker_register/JobSeekerRegister";
import AppliedJobListPage from "./components/job_list/AppliedJobsListPage";
import SavedJobListPage from "./components/job_list/SavedJobsListPage";
import AppliedJobDetails from "./components/job_details/AppliedJobDetails";


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register/employer" element={<EmployerRegister />} />
        <Route path="/register/jobseeker" element={<JobSeekerRegister />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/job-seeker/*" element={<JobSeekerLayout />} >
          <Route path="dashboard" element={<DashBoardPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="saved-jobs" element={<SavedJobListPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="edit-profile" element={<UpdateJobSeekerProfile />} />
          <Route path="job-details/:jobId" element={<JobDetails />} />
          <Route path="job-details/:jobId/questions" element={<JobQuestions />} />
          <Route path="job-details/:jobId/application" element={<AppliedJobDetails />} />
          <Route path="applied-jobs" element={<AppliedJobListPage />} />
        </Route>
        <Route path='/create-job' element={<JobCreation />} />
        <Route path="/all-jobs" element={<JobListPage />} />
        {/* <PrivateRoute component={Dashboard} path='/dashboard'/> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
