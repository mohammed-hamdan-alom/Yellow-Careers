import React from "react";
import SideBar from "../sidebar/SideBar";
import "./JobSeekerLayout.css";
import { Outlet } from "react-router-dom";


function JobSeekerLayout() {
  return (
    <div className="job-seeker-layout">
      <SideBar />
      <div className="content">
        <Outlet /> {/* This is where nested routes will be rendered */}
      </div>
    </div>
  );
}

export default JobSeekerLayout;
