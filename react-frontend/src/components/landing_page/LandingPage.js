import React from "react";
import "./LandingPage.css"; // Make sure to create this CSS file for styling
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>YellowCareers</h1>
        <p>A career management application by Team Yellow.</p>
        <div className="button-group">
          <Link to="/register/jobseeker" className="btn btn-primary">
            Register jobseeker
          </Link>
          <Link to="/register/employer" className="btn btn-primary">
            Register employer
          </Link>
          {/* Replace the login button with a Link */}
          <Link to="/login" className="btn btn-secondary">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
