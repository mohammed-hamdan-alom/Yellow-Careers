import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login/LoginPage";
import DashBoardPage from "./components/dashboard/DashBoardPage";
import JobSeekerLayout from "./components/layout/JobSeekerLayout";
import SearchPage from "./components/search/SearchPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/job-seeker/*" element={<JobSeekerLayout />}>
          <Route path="dashboard" element={<DashBoardPage />} />
          <Route path="search" element={<SearchPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
