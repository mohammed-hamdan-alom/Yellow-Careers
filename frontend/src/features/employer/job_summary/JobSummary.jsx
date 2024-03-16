import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from "@/utils/AxiosInstance";
import JobCard from "@/components/job-card/JobCard";

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
    navigate(`/employer/job-details/${job.id}`);
  };


  const formattedDescription = job.description.split('\n').map((paragraph, index) => (
    <React.Fragment key={index}>
      {paragraph}
      <br />
    </React.Fragment>
  ));

  return (
    <div className="w-full justify-center" onClick={handleClick}>
      <JobCard title={job.title} companyName={company.name} city={address.city} country={address.country} description={formattedDescription} />
    </div>
  );
};

export default JobSummary;
