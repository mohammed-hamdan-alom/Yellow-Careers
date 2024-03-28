import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../JobCard/JobCard";
import AuthContext from "@/context/AuthContext";

/**
 * Renders a summary of a job.
 */
const JobSummary = ({ job }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  /**
   * Handles the click event when the job summary is clicked.
   * Navigates to the job details page based on the user type.
   */
  const handleClick = () => {
    if (user && user.user_type === "employer") {
      navigate(`/employer/job-details/${job.id}`);
    } else {
      navigate(`/job-seeker/job-details/${job.id}`);
    }
  };

  const formattedDescription = (
    job.description.length > 200 ? job.description.substring(0, 200) + "..." : job.description
  )
    .split("\n")
    .map((paragraph, index) => (
      <React.Fragment key={index}>
        {paragraph}
        <br />
      </React.Fragment>
    ));

  return (
    <div className="w-full justify-center" onClick={handleClick}>
      <JobCard
        title={job.title}
        companyName={job.company.company_name}
        city={job.address.city}
        country={job.address.country}
        description={formattedDescription}
        salary={job.salary}
        jobType={job.job_type}
      />
    </div>
  );
};

export default JobSummary;
