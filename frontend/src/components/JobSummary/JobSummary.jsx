import React, { useEffect, useState, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useNavigate } from "react-router-dom";
import AxiosInstance from "@/utils/AxiosInstance";
import JobCard from "../job-card/JobCard";
import AuthContext from "@/context/AuthContext";

const JobSummary = ({ job }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [company, SetCompany] = useState({});
  const [address, setAddress] = useState({});

  useEffect(() => {
    AxiosInstance.get(`api/jobs/${job.id}/company/`).then((res) =>
      SetCompany(res.data)
    );
    AxiosInstance.get(`api/jobs/${job.id}/address/`).then((res) =>
      setAddress(res.data)
    );
  }, []);

  const handleClick = () => {
    if (user && user.user_type === 'employer') {
      navigate(`/employer/job-details/${job.id}`);
    } else {
      navigate(`/job-seeker/job-details/${job.id}`);
    }
  };

  const formattedDescription = job.description
    .split("\n")
    .map((paragraph, index) => (
      <React.Fragment key={index}>
        {paragraph}
        <br />
      </React.Fragment>
    ));

  return (
    <div className="w-full justify-center" onClick={handleClick}>
      <JobCard title={job.title} companyName={company.company_name} city={address.city} country={address.country} description={formattedDescription} />
    </div>
  );
};

export default JobSummary;