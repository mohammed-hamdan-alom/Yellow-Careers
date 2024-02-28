import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JobSummary.css';
import AxiosInstance from '../Axios';

const JobSummary = ({ job }) => {
  const navigate = useNavigate();
  const [company, SetCompany] = useState({});
  const [address, setAddress] = useState({});

  useEffect(() => {
    AxiosInstance.get(`api/jobs/${job.id}/company/`)
      .then((res) => SetCompany(res.data))
    AxiosInstance.get(`api/jobs/${job.id}/address/`)
      .then((res) => setAddress(res.data))
  }, []);

  const handleClick = () => {
    // navigate to the job details page
    navigate(`/job-seeker/job-details/${job.id}`);
  };


  const formattedDescription = job.description.split('\n').map((paragraph, index) => (
    <React.Fragment key={index}>
      {paragraph}
      <br />
    </React.Fragment>
  ));

  return (
    <div className="job-summary" onClick={handleClick}>
      <h3>{job.title}</h3>
      <h4>{company.company_name}</h4>
      <p className="description">{formattedDescription}</p>
      <strong>Location:</strong> {address.city}, {address.country}
    </div>
  );
};

export default JobSummary;
