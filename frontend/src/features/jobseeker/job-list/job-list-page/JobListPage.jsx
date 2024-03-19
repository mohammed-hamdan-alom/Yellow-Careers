import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import JobFilterList from "../../../../components/search/JobFilterList";
import { Label } from "@/components/ui/label";

const JobListPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user.user_id;

  const [jobs, setJobs] = useState(undefined);
  const [resume, setResume] = useState({});
  const [isJobRetrieved, setIsJobRetrieved] = useState(false);

  useEffect(() => {
    async function fetchData() {
      AxiosInstance.get(`api/job-seeker/${userId}/resume/`)
        .then((response) => {
          setResume(response.data)
          if (response.data.id !== undefined) {
            AxiosInstance.get(`api/job-seeker/${userId}/matched-jobs/`)
              .then((res) => {
                setJobs(res.data)
                setIsJobRetrieved(true);
              }).catch((error) => console.error('Error fetching data:', error));
          }
        })
    }
    fetchData();
  }, [isJobRetrieved]);
  return (
    <div className="flex flex-col justify-center">
      <Label className="text-3xl">Job List</Label>
      {resume.id && jobs ? (
        <JobFilterList data={jobs} />
      ) : (
        <h1>Error loading the jobs, please create a resume. If you have already done so, reload the page</h1>
      )}
    </div>
  );
};

export default JobListPage;
