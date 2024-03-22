import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import ApplicantSummary from "@/features/employer/job_applicants/ApplicantSummary"
import Swal from 'sweetalert2';
import { Label } from '@/components/ui/label';
import { Button, Space } from 'antd';
import '@/components/styling/button.css';


const JobApplicantsPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user.user_id;

  const [applications, setApplications] = useState([]);
  const [jobSeeker, setJobSeeker] = useState({});
  const { jobId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicants = async (retryCount = 0) => {
      try {
        const response = await AxiosInstance.get(`api/applications/job/${jobId}`);
        setApplications(response.data);
      } catch (error) {
        console.error("Error:", error.response.data);
        if (error.response && (error.response.status === 403 || error.response.status === 404)) {
          window.location.href = "/employer/dashboard";
        }
        // Retry logic
        const maxRetries = 3;
        if (retryCount < maxRetries) {
          const delay = 2000; // 2 seconds delay, adjust as needed
          console.log(`Retrying after ${delay} milliseconds...`);
          setTimeout(() => {
            fetchApplicants(retryCount + 1); // Retry with incremented retryCount
          }, delay);
        } else {
          console.error("Max retries exceeded. Unable to fetch data.");
          // Handle max retries exceeded, maybe display an error message
        }
      }
    };
  
    fetchApplicants();
  }, []);
  

  const handleShowDetails = () => {
    navigate(`/employer/job-details/${jobId}`);
  }

  return (
    <div>
      <button onClick={handleShowDetails}> Job Details </button>
      <h2>Matched applicants</h2>
      {applications.map(application => (
        <ul key={application.id}>
          <ApplicantSummary id={application.id}></ApplicantSummary>
        </ul>
      ))}
    </div>
  )
};



export default JobApplicantsPage;