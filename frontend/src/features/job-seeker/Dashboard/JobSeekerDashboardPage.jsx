import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import JobFilterAndList from "@/components/Search/JobFilterAndList";
import { Label } from "@/components/ui/label";
import { handleErrorAndShowMessage } from "@/components/handleErrorAndShowMessage/handleErrorAndShowMessage";

const JobSeekerDashboardPage = () => {
  const { user, updateToken } = useContext(AuthContext);
  const userId = user.user_id;

  const [jobs, setJobs] = useState(undefined);
  const [resume, setResume] = useState({});
  const [isJobRetrieved, setIsJobRetrieved] = useState(false);

  useEffect(() => {
    const fetchResumeAndJobs = async () => {
      try {
        const response = await AxiosInstance.get(`api/job-seeker/${userId}/resume/`);
        setResume(response.data);
        if (response.data.id !== undefined) {
          const res = await AxiosInstance.get(`api/job-seeker/${userId}/matched-jobs/`);
          setJobs(res.data);
          setIsJobRetrieved(true);
        }
      } catch (error) {
        handleErrorAndShowMessage("Error retrieving data:", error);
      }
    };

    fetchResumeAndJobs();
  }, [isJobRetrieved]);

  return (
    <div className="flex flex-col justify-center">
      <Label className="text-3xl">Job List</Label>
      {resume.id && jobs ? (
        <JobFilterAndList jobs={jobs} />
      ) : (
        <h1 className="mt-3">Loading... Please ensure you have created a resume</h1>
      )}
    </div>
  );
};

export default JobSeekerDashboardPage;
