import SideBar from "../sidebar/SideBar";
import { Outlet } from "react-router-dom";
import React, { useState } from 'react';
import './JobSeekerLayout.css';

function JobSeekerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="job-seeker-layout">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`content ${!isSidebarOpen ? 'collapsed' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default JobSeekerLayout;
