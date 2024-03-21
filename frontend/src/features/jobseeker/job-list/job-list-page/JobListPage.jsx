import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import JobSearchBar from "../../../../components/search/JobSearchBar";
import { Label } from "@/components/ui/label";

const JobListPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user.user_id;

  const [jobs, setJobs] = useState(undefined);
  const [resume, setResume] = useState({});
  const [jobRetrieved, setJobRetrieved] = useState(false);

  useEffect(() => {
    const fetchResumeAndJobs = async () => {
      try {
        const response = await AxiosInstance.get(`api/job-seeker/${userId}/resume/`);
        setResume(response.data);
        if (response.data.id !== undefined) {
          const res = await AxiosInstance.get(`api/job-seeker/${userId}/matched-jobs/`);
          setJobs(res.data);
          setJobRetrieved(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchResumeAndJobs();
  }, [jobRetrieved]);

  return (
    <div className="flex flex-col justify-center">
      {resume.id && jobs ? (
        <JobSearchBar database={jobs} />
      ) : (
        <h1>Error loading the jobs, please create a resume. If you have already done so, reload the page</h1>
      )}
    </div>
  );
};

export default JobListPage;
