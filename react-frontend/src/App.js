import {Routes, Route} from "react-router-dom";
import LoginPage from "./components/login/LoginPage";
import Register from './components/register/Register';
import { AuthProvider } from './context/AuthContext';
import DashBoardPage from "./components/dashboard/DashBoardPage";
import JobSeekerLayout from "./components/layout/JobSeekerLayout";
import SearchPage from "./components/search/SearchPage";
import LandingPage from "./components/landing_page/LandingPage";
import JobCreation from "./components/job_creation/JobCreation";
import JobListPage from "./components/job_list/JobListPage";
// import PrivateRoute from './utils/PrivateRoute';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ProfilePage from "./components/profile/ProfilePage";
import ResumePage from "./components/resume/ResumePage";


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path='/create-job' element={<JobCreation />} />
        <Route path="/all-jobs" element={<JobListPage />} />
        <Route path="/job-seeker/*" element={<JobSeekerLayout />}>
          <Route path="dashboard" element={<DashBoardPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="resume/" element={<ResumePage />}/>
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        
      </Routes>
    </AuthProvider>
  );
}

export default App;
