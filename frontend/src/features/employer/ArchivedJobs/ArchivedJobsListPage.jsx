import React, { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import EmployerJobList from "../ToggleJobs/EmployerJobList";

function ArchivedJobsListPage() {
  const { user } = useContext(AuthContext);
  const userId = user.user_id;
  const [employerArchivedJobs, setEmployerArchivedJobs] = useState([]);
  const [companyArchivedJobs, setCompanyArchivedJobs] = useState([]);
  const [showCompanyArchivedJobs, setShowCompanyArchivedJobs] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const archivedJobsResponse = await AxiosInstance.get(
          `api/employer/${userId}/jobs/archived/`
        );
        const jobsWithCompany = await Promise.all(
          archivedJobsResponse.data.map(async (job) => {
            const companyRes = await AxiosInstance.get(`api/jobs/${job.id}/company/`);
            return { ...job, company: companyRes.data };
          })
        );
        setEmployerArchivedJobs(jobsWithCompany);

        const employerResponse = await AxiosInstance.get(`api/employers/${userId}/`);

        if (employerResponse.data.is_company_admin) {
          const companyArchivedJobsResponse = await AxiosInstance.get(
            `api/employer/${userId}/company-jobs/archived/`
          );
          const jobsWithCompany = await Promise.all(
            companyArchivedJobsResponse.data.map(async (job) => {
              const companyRes = await AxiosInstance.get(`api/jobs/${job.id}/company/`);
              return { ...job, company: companyRes.data };
            })
          );
          setCompanyArchivedJobs(jobsWithCompany);
          setShowCompanyArchivedJobs(jobsWithCompany.length > 0);
        }
      } catch (error) {
        console.error("Error fetching archived jobs:", error);
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
        isAdmin={showCompanyArchivedJobs}
        companyJobs={companyArchivedJobs}
        employerJobs={employerArchivedJobs}
        text={"Archived"}
      />
    </div>
  );
}

export default ArchivedJobsListPage;
