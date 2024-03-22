import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";

const JobApplicantsPage = () => {
    const [applicants, setApplicants] = useState([]);
    const [filteredApplicants, setFilteredApplicants] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [decisionFilter, setDecisionFilter] = useState('all');

    const { jobId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
      const fetchApplicants = async () => {
        try {
          const response = await AxiosInstance.get(`api/applicants/${jobId}`);
          setApplicants(response.data);
          setFilteredApplicants(response.data);
        } catch (error) {
          console.error("Error:", error.response.data);
          if (error.response && (error.response.status === 403 || error.response.status === 404)) {
            window.location.href = "/employer/dashboard";
          }
        }
      };
    
      fetchApplicants();
    }, []);

    useEffect(() => {
      const filtered = applicants.filter(applicant => 
          (statusFilter === 'all' || applicant.status === statusFilter) &&
          (decisionFilter === 'all' || applicant.decision === decisionFilter)
      );

      setFilteredApplicants(filtered);
  }, [statusFilter, decisionFilter, applicants]);

    const handleShowDetails = () => {
        navigate(`/employer/job-details/${jobId}`);
    }

    const handleShowApplication = async (key) => {
        try {
          const res = await AxiosInstance.get(`api/applications/${key}/${jobId}`);
          const applicationId = res.data.id;
          navigate(`/employer/application-details/${applicationId}`);
        } catch (error) {
          console.error("Error:", error.response.data);
        }
      };

    return (
        <div>
            <button onClick={handleShowDetails}> Job Details </button>
            <h2>Matched applicants</h2>
            <div>
                <label>Status Filter:</label>
                <select onChange={e => setStatusFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                </select>
                <label>Decision Filter:</label>
                <select onChange={e => setDecisionFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="undecided">Undecided</option>
                    <option value="rejected">Rejected</option>
                    <option value="accepted">Accepted</option>
                </select>
            </div>
            {filteredApplicants.map(applicant => (
                <ul key={applicant.id}>
                    <h3>
                        <button onClick={() => handleShowApplication(applicant.id)}> Show Application </button>
                        {applicant.first_name} {applicant.last_name} - Status: {applicant.status}, Decision: {applicant.decision}
                    </h3>
                </ul>
            ))}
        </div>
    )
};

export default JobApplicantsPage;