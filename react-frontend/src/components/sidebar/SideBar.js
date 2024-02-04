import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // If not already imported elsewhere
import React from "react";
import { useState } from "react";

function SideBar() {
  const [isOpen, setIsOpen] = useState(true); // State to manage sidebar open/close

  return (
    <div>
      {/* Button to toggle the sidebar */}
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Close" : "Open"} Sidebar
      </button>

      {/* Sidebar contents, hidden when isOpen is false */}
      <div
        className={`bg-light border ${isOpen ? "" : "collapse"}`}
        id="sidebarMenu"
      >
        <div className="list-group list-group-flush">
          <Link
            to="/job-seeker/dashboard"
            className="list-group-item list-group-item-action bg-light"
          >
            Dashboard
          </Link>
          <Link
            to="/job-seeker/search"
            className="list-group-item list-group-item-action bg-light"
          >
            Search
          </Link>
          {/* More links */}
        </div>
      </div>
    </div>
  );
}

export default SideBar;