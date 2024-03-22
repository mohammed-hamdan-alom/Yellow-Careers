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

  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [decisionFilter, setDecisionFilter] = useState('all');

  const { jobId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await AxiosInstance.get(`api/applications/job/${jobId}`);
        setApplications(response.data);
        setFilteredApplications(response.data);
      } catch (error) {
        console.error("Error:", error.response.data);
        if (error.response && (error.response.status === 403 || error.response.status === 404)) {
          window.location.href = "/employer/dashboard";
        }
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    const filtered = applications.filter(application => 
        (statusFilter === 'all' || application.status === statusFilter) &&
        (decisionFilter === 'all' || application.decision === decisionFilter)
    );

    setFilteredApplications(filtered);
}, [statusFilter, decisionFilter, applications]);


  const handleShowDetails = () => {
    navigate(`/employer/job-details/${jobId}`);
  }

  return (
    <div>
      <button onClick={handleShowDetails}> Job Details </button>
      <h2>Matched applicants</h2>
      <div>
          <label>Status Filter:</label>
          <select onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="U">Unread</option>
              <option value="R">Read</option>
          </select>
          <label>Decision Filter:</label>
          <select onChange={e => setDecisionFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="U">Undecided</option>
              <option value="R">Rejected</option>
              <option value="A">Accepted</option>
          </select>
      </div>
      {filteredApplications.map(application => (
        <ul key={application.id}>
          <ApplicantSummary id={application.id} />
        </ul>
      ))}
    </div>
  )
};



export default JobApplicantsPage;