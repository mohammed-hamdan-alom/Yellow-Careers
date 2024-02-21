import React from "react";
import "./DashBoardPage.css";
import JobListPage from "../job_list/JobListPage";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap-icons/font/bootstrap-icons.css";

const DashBoardPage = () => {

  const { user } = useContext(AuthContext);
  const userId = user.user_id;

  return (
    <div className="dashboard-page">
      <h2>Dashboard Page</h2>
      <p>Jobs tailored for you!</p>
      {<JobListPage></JobListPage>}
    </div>
  );
}
export default DashBoardPage;