import React from "react";
// import "./DashBoardPage.css";
import JobListPage from "../job-list/job-list-page/JobListPage";


const DashBoardPage = () => {

  return (
    <div className="dashboard-page">
      <h2>Dashboard Page</h2>
      <p>Jobs tailored for you!</p>
      {/* lists all the matched jobs */}
      {<JobListPage></JobListPage>}
    </div>
  );
}
export default DashBoardPage;