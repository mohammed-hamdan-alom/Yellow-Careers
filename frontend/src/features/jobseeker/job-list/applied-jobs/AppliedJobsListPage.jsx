import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import JobFilter from "@/components/search/JobFilter";

function AppliedJobListPage() {
  //
  const { user } = useContext(AuthContext);
  const userId = user.user_id;

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchAppliedJobs = async (retryCount = 0) => {
      try {
        const res = await AxiosInstance.get(`api/job-seeker/${userId}/applied-jobs/`);
        setJobs(res.data);
      } catch (error) {
        console.error("Error:", error);
        // Retry logic
        const maxRetries = 3;
        if (retryCount < maxRetries) {
          const delay = 2000; // 2 seconds delay, adjust as needed
          console.log(`Retrying after ${delay} milliseconds...`);
          setTimeout(() => {
            fetchAppliedJobs(retryCount + 1); // Retry with incremented retryCount
          }, delay);
        } else {
          console.error("Max retries exceeded. Unable to fetch applied jobs.");
          // Handle max retries exceeded, maybe display an error message
        }
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