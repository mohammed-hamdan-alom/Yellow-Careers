import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import JobSearchList from "../../../../components/search/JobSearchList";

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
    <div>
      <h1>Saved Jobs:</h1>
      {jobs.length > 0 ? (
        <JobSearchList data={jobs} />
      ) : (
        <h1>No saved jobs</h1>
      )}
    </div>
  );
}

export default SavedJobListPage;
