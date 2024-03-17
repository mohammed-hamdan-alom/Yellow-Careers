import React from 'react';
import './JobDetailsDisplay.css';

const JobDetailsDisplay = ({ title, description, companyName, salary, jobType, address }) => {
  return (
    <div>
      <h1>{title}</h1>
      <h2>{description}</h2>
      <h3>{companyName}</h3>
      <h4>Salary: {salary}</h4>
      <h4>Job Type: {jobType}</h4>
      <h4><strong>Location:</strong> {address.post_code}, {address.city}, {address.country}</h4>
    </div>
  );
};

export default JobDetailsDisplay;
