import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login/LoginPage";
import Register from './components/register/Register';
import { AuthProvider } from './context/AuthContext';
import DashBoardPage from "./components/dashboard/DashBoardPage";
import JobSeekerLayout from "./components/layout/JobSeekerLayout";
import SearchPage from "./components/search/SearchPage";
import LandingPage from "./components/landing_page/LandingPage";
// import PrivateRoute from './utils/PrivateRoute';
import "bootstrap/dist/js/bootstrap.bundle.min.js";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/register' element={<Register />} />
          <Route path="/job-seeker/*" element={<JobSeekerLayout />}>
            <Route path="dashboard" element={<DashBoardPage />} />
            <Route path="search" element={<SearchPage />} />
          </Route>
          {/* <PrivateRoute component={Dashboard} path='/dashboard'/> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
