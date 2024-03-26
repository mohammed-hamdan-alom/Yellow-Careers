import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import AxiosInstance from "@/utils/AxiosInstance";
import { Button, Space } from "antd";
import "@/components/styling/button.css";
import JobDetailsDisplay from "@/components/JobDetails/JobDetails";
import { FloatButton } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { handleErrorAndShowMessage } from "@/components/handleErrorAndShowMessage/handleErrorAndShowMessage";

function JobSeekerJobDetailsPage() {
  const { user } = useContext(AuthContext);
  const userId = user.user_id;

  const { jobId } = useParams();

  const navigate = useNavigate();

  const [job, setJob] = useState({});
  const [savedJobs, setSavedJobs] = useState([]);
  const [isJobSaved, setIsJobSaved] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isJobApplied, setIsJobApplied] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [resume, setResume] = useState({});
  const [address, setAddress] = useState({});
  const [company, setCompany] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          AxiosInstance.get(`api/jobs/${jobId}/`),
          AxiosInstance.get(`api/jobs/${jobId}/company/`),
          AxiosInstance.get(`api/jobs/${jobId}/address/`),
          AxiosInstance.get(`api/jobs/${jobId}/questions/`),
          AxiosInstance.get(`api/job-seeker/${userId}/resume/`),
          AxiosInstance.get(`api/job-seeker/${userId}/applied-jobs/`),
        ]);
        setJob(responses[0].data);
        setCompany(responses[1].data);
        setAddress(responses[2].data);
        setQuestions(responses[3].data);
        setResume(responses[4].data);
        setAppliedJobs(responses[5].data);
        setIsJobApplied(
          responses[5].data.some((appliedJob) => String(appliedJob.id) === String(jobId)),
        );
      } catch (error) {
        handleErrorAndShowMessage("Error fetching data:", error);
      }
    };

    fetchData();
  }, [jobId, userId]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await AxiosInstance.get(`api/job-seeker/${userId}/saved-jobs/`);
        setSavedJobs(res.data);
        setIsJobSaved(res.data.some((savedJob) => String(savedJob.id) === String(jobId)));
      } catch (error) {
        handleErrorAndShowMessage("Error fetching data:", error);
      }
    };

    fetchSavedJobs();
  }, [isJobSaved]);

  const handleApply = async () => {
    if (questions.length === 0) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Are you sure you want to apply for this job?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FFD700",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, apply!",
      });

      if (result.isConfirmed) {
        const applicationData = {
          job_seeker: userId,
          job: jobId,
          resume: resume.id,
        };
        try {
          await AxiosInstance.post("api/applications/create/", applicationData);
          window.location.reload(); // Reload the page after applying
        } catch (error) {
          handleErrorAndShowMessage("Error creating an application:", error);
        }
      }
    } else {
      navigate(`questions/`);
    }
  };

  const handleSeeApplication = async () => {
    try {
      const res = await AxiosInstance.get(`api/applications/${userId}/${jobId}`);
      const applicationId = res.data.id;
      navigate(`/job-seeker/application-details/${applicationId}`);
    } catch (error) {
      handleErrorAndShowMessage("Error seeing application:", error);
    }
  };

  const handleSave = async () => {
    const savedJob = savedJobs.find((savedJob) => String(savedJob.id) === String(jobId));
    if (savedJob) {
      try {
        await AxiosInstance.delete(`api/saved-jobs/update/${userId}/${jobId}/`);
        setIsJobSaved(false);
      } catch (error) {
        handleErrorAndShowMessage("Error unsaving a job:", error);
      }
    } else {
      try {
        await AxiosInstance.post(`api/saved-jobs/create/`, {
          job_seeker: userId,
          job: jobId,
        });
        setIsJobSaved(true);
      } catch (error) {
        handleErrorAndShowMessage("Error saving a job:", error);
      }
    }
  };

  const handleFloatButtonClick = () => {
    window.open(company.website, "_blank");
  };

  return (
    <div>
      <div className="mb-3">
        <JobDetailsDisplay
          title={job.title}
          description={job.description}
          companyName={company.company_name}
          salary={job.salary}
          jobType={job.job_type}
          address={address}
        />
      </div>
      <Space>
        {isJobApplied ? (
          <Button className="yellowButton large-button" onClick={handleSeeApplication}>
            See Application
          </Button>
        ) : (
          <Button className="yellowButton large-button" onClick={handleApply}>
            Apply
          </Button>
        )}
        {isJobSaved ? (
          <Button className="redButton large-button" onClick={handleSave}>
            Unsave
          </Button>
        ) : (
          <Button className="blueButton large-button" onClick={handleSave}>
            Save
          </Button>
        )}
        <FloatButton
          tooltip={<div>Visit Company Page</div>}
          onClick={handleFloatButtonClick}
          size="large"
          style={{ backgroundColor: "#FFD700", width: "50px", height: "50px" }}
          icon={<GlobalOutlined />}
        />
      </Space>
    </div>
  );
}
export default JobSeekerJobDetailsPage;
