import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import JobFilter from "@/components/search/JobFilter";
import { Label } from "@/components/ui/label";
import { checkUserIdAndReload } from  "@/components/refreshUser/refreshUser";
import { handleErrorAndShowMessage } from '@/components/error_handler/error_display';

const JobListPage = () => {
  const { user, updateToken } = useContext(AuthContext);
  const userId = user.user_id;

  const [jobs, setJobs] = useState(undefined);
  const [resume, setResume] = useState({});
  const [isJobRetrieved, setIsJobRetrieved] = useState(false);

  useEffect(() => {
    const fetchResumeAndJobs = async () => {
      updateToken();
      try {
        const response = await AxiosInstance.get(`api/job-seeker/${userId}/resume/`);
        setResume(response.data);
        if (response.data.id !== undefined) {
          const res = await AxiosInstance.get(`api/job-seeker/${userId}/matched-jobs/`);
          setJobs(res.data);
          setIsJobRetrieved(true);
        }

      } catch (error) {
        checkUserIdAndReload(userId);
        handleErrorAndShowMessage("Error retrieving data:", error);
      }
    };

    fetchResumeAndJobs();
  }, [isJobRetrieved]);

  return (
    <div className="flex flex-col justify-center">
      <Label className="text-3xl">Job List</Label>
      {resume.id && jobs ? (
        <JobFilter data={jobs} />
      ) : (
        <h1>Loading... Please create a resume</h1>
      )}
    </div>
  );
};

export default JobListPage;
