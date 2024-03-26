import React, { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import JobFilterAndList from "@/components/Search/JobFilterAndList";

function ArchivedJobsListPage() {
  const { user } = useContext(AuthContext);
  const userId = user.user_id;
  const [archivedJobs, setArchivedJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const archivedJobsResponse = await AxiosInstance.get(
          `api/employer/${userId}/jobs/archived/`
        );
        setArchivedJobs(archivedJobsResponse.data);
      } catch (error) {
        console.error("Error fetching archived jobs:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div>
      <JobFilterAndList jobs={archivedJobs} />
    </div>
  );
}

export default ArchivedJobsListPage;
