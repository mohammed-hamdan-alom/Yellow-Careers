import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import JobList from "../../../../components/search/JobList";
import { Label } from "@/components/ui/label";

function SavedJobListPage() {
  // get the user id from the context
  const { user } = useContext(AuthContext);
  const userId = user.user_id;

  // get the saved jobs of the job seeker
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await AxiosInstance.get(`api/job-seeker/${userId}/saved-jobs/`);
        setJobs(res.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchJobs();
  }, [userId]);

  // display the saved jobs
  return (
    <div className="flex flex-col justify-center">
      {jobs.length > 0 ? (
        <JobList data={jobs} />
      ) : (
        <Label className="text-lg text-gray-500 font-semibold mt-4">No Saved jobs</Label>
      )}
    </div>
  );
}

export default SavedJobListPage;
