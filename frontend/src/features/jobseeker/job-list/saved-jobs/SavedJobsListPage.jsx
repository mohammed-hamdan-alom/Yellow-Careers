import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import JobSearchList from "../../../../components/search/JobSearchList";
import { Label } from "@/components/ui/label";

function SavedJobListPage() {
  // get the user id from the context
  const { user } = useContext(AuthContext);
  const userId = user.user_id;

  // get the saved jobs of the job seeker
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    AxiosInstance.get(`api/job-seeker/${userId}/saved-jobs/`).then((res) =>
      setJobs(res.data)
    );
  }, [userId]);

  // display the saved jobs
  return (
    <div className="flex flex-col justify-center">
      {jobs.length > 0 ? (
        <JobSearchList data={jobs} />
      ) : (
        <Label className="text-lg text-gray-500 font-semibold mt-4">No Saved jobs</Label>
      )}
    </div>
  );
}

export default SavedJobListPage;
