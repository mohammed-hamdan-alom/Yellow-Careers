import EmployerSideBar from "../sidebar/EmployerSideBar";

import { Outlet } from "react-router-dom";
import React, { useState } from "react";
// import "./EmployerLayout.css";

function EmployerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="job-seeker-layout">
      <EmployerSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`content ${!isSidebarOpen ? "collapsed" : ""}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default EmployerLayout;
