import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "@/utils/AxiosInstance";
import JobCard from "../job-card/JobCard";
import AuthContext from "@/context/AuthContext";

const JobSummary = ({ job }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [company, setCompany] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const companyResponse = await AxiosInstance.get(`api/jobs/${job.id}/company/`);
      setCompany(companyResponse.data);
    };

    fetchData();
  }, []);

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
        companyName={company.company_name}
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
