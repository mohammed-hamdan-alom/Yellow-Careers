import React, { useEffect } from "react";
import JobListPage from "../job-list/job-list-page/JobListPage";

const DashBoardPage = () => {
  useEffect(() => {
    const hasRefreshed = localStorage.getItem("hasRefreshed");

    // Check if the page has been refreshed already
    if (!hasRefreshed) {
      // Set a timeout to refresh the page after 3 seconds (adjust as needed)
      const timer = setTimeout(() => {
        window.location.reload();
        // Set the flag in localStorage to indicate the page has been refreshed
        localStorage.setItem("hasRefreshed", true);
      }, 3000); // 3 seconds delay

      // Clear the timeout when the component unmounts
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
