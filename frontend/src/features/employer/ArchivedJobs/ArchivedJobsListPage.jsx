import React, { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import JobFilterAndList from "@/components/Search/JobFilterAndList";

function ArchivedJobsListPage() {
  const { user } = useContext(AuthContext);
  const userId = user.user_id;
  const [archivedJobs, setArchivedJobs] = useState([]);
  const [companyArchivedJobs, setCompanyArchivedJobs] = useState([]);
  const [showCompanyArchivedJobs, setShowCompanyArchivedJobs] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const archivedJobsResponse = await AxiosInstance.get(
          `api/employer/${userId}/jobs/archived/`
        );
        setArchivedJobs(archivedJobsResponse.data);

        const employerResponse = await AxiosInstance.get(`api/employers/${userId}/`);

        if (employerResponse.data.is_company_admin) {
          const companyArchivedJobsResponse = await AxiosInstance.get(
            `api/employer/${userId}/company-jobs/archived/`
          );
          setCompanyArchivedJobs(companyArchivedJobsResponse.data);
          setShowCompanyArchivedJobs(companyArchivedJobsResponse.data.length > 0);
        }
      } catch (error) {
        console.error("Error fetching archived jobs:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div>
      {showCompanyArchivedJobs ? (
        <JobFilterAndList jobs={companyArchivedJobs} />
      ) : (
        <JobFilterAndList jobs={archivedJobs} />
      )}
    </div>
  );
}

export default ArchivedJobsListPage;
