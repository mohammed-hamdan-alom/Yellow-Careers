import React, { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import EmployerJobList from "../ToggleJobs/EmployerJobList";

function EmployerDashboardPage() {
  const { user } = useContext(AuthContext);
  const userId = user.user_id;
  const [employerJobs, setEmployerJobs] = useState([]);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [showCompanyJobs, setShowCompanyJobs] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employerJobsResponse = await AxiosInstance.get(`api/employer/${userId}/jobs/active`);

        const jobsWithCompany = await Promise.all(
          employerJobsResponse.data.map(async (job) => {
            const companyRes = await AxiosInstance.get(`api/jobs/${job.id}/company/`);
            return { ...job, company: companyRes.data };
          })
        );
        setEmployerJobs(jobsWithCompany);

        const employerResponse = await AxiosInstance.get(`api/employers/${userId}/`);

        if (employerResponse.data.is_company_admin) {
          const companyJobsResponse = await AxiosInstance.get(
            `api/employer/${userId}/company-jobs/active`
          );
          const jobsWithCompany = await Promise.all(
            companyJobsResponse.data.map(async (job) => {
              const companyRes = await AxiosInstance.get(`api/jobs/${job.id}/company/`);
              return { ...job, company: companyRes.data };
            })
          );
          setCompanyJobs(jobsWithCompany);
          setShowCompanyJobs(jobsWithCompany.length > 0);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <EmployerJobList
        isAdmin={showCompanyJobs}
        companyJobs={companyJobs}
        employerJobs={employerJobs}
        text={"Active"}
      />
    </div>
  );
}

export default EmployerDashboardPage;
