import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import JobSearchBar from "@/components/search/JobSearchBar";
import { Label } from "@/components/ui/label";

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
        console.error("Error:", error);
      }
    };
  
    fetchAppliedJobs();
  }, [userId]);

  return (
    <div className=" flex flex-col justify-center">
      {jobs.length > 0 ? (
      <JobSearchBar database={jobs} />
    ) : (
      <h1>No applied jobs</h1>
      )}
    </div>
  );
}

export default AppliedJobListPage;