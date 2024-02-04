import React from 'react'
import { Link } from "react-router-dom";


function SideBar() {
  return (
    <div className="sidebar">
      <h3>Navigation</h3>
      <ul>
        <li>
          <Link to="/job-seeker/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/job-seeker/search">Search</Link>
        </li>
      </ul>
    </div>
  );

}

export default SideBar