import React, { useEffect } from "react";
import JobListPage from "../job-list/job-list-page/JobListPage";

const DashBoardPage = () => {
  useEffect(() => {
    const hasRefreshed = localStorage.getItem("hasRefreshed");

    if (!hasRefreshed) {
      const timer = setTimeout(() => {
        location.reload();
        localStorage.setItem("hasRefreshed", true);
      }, 500); 

      return () => clearTimeout(timer);
    }
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className="dashboard-page">
      <JobListPage />
    </div>
  );
}

export default DashBoardPage;
