import React from 'react';
import { useNavigate } from 'react-router-dom';
import './JobSummary.css';

const JobSummary = ({ id, title, hirer, description, location }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // navigate to the job details page
    navigate(`/job-seeker/job-details/${id}`);
  };

  const formattedDescription = description.split('\n').map((paragraph, index) => (
    <React.Fragment key={index}>
      {paragraph}
      <br />
    </React.Fragment>
  ));

  return (
    <div className="job-summary" onClick={handleClick}>
      <h3>{title}</h3>
      <h4>{hirer}</h4>
      <p className="description">{formattedDescription}</p>
      {location && <p><strong>Location:</strong> {location}</p>}
    </div>
  );
};

export default JobSummary;
 