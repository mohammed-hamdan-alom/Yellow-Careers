import React, { useEffect } from "react";
import JobListPage from "../job-list/job-list-page/JobListPage";

const DashBoardPage = () => {
  useEffect(() => {
    const hasRefreshed = localStorage.getItem("hasRefreshed");

    if (!hasRefreshed) {
      const timer = setTimeout(() => {
        window.location.reload();
        localStorage.setItem("hasRefreshed", true);
      }, 1500); 

      return () => clearTimeout(timer);
    }
  }, []); 

  return (
    <div className="dashboard-page">
      <JobListPage />
    </div>
  );
}

export default DashBoardPage;
