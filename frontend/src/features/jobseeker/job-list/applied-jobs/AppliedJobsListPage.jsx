import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import JobFilter from "@/components/search/JobFilter";
import { checkUserIdAndReload } from "@/components/refreshUser/refreshUser"
import { handleErrorAndShowMessage } from '@/components/error_handler/error_display';

function AppliedJobListPage() {
  //
  const { user } = useContext(AuthContext);
  const userId = user.user_id;

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    
    const fetchAppliedJobs = async () => {
      try {
        const res = await AxiosInstance.get(`api/job-seeker/${userId}/applied-jobs/`);
        setJobs(res.data);
      } catch (error) {
        checkUserIdAndReload(userId);
        handleErrorAndShowMessage("Error retrieving data:", error);
      }
    };
  
    fetchAppliedJobs();
  }, [userId]);

  return (
    <div className=" flex flex-col justify-center">
      {jobs.length > 0 ? (
        <JobFilter data={jobs} />
      ) : (
        <h1>No applied jobs</h1>
      )}
    </div>
  );
}

export default AppliedJobListPage;