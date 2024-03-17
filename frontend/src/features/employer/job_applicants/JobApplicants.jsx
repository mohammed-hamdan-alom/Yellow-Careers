import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import ApplicantSummary from "@/features/employer/job_applicants/ApplicantSummary"

const JobApplicantsPage = () => {
    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    const [applications, setApplications] = useState([]);
    const [jobSeeker, setJobSeeker] = useState({});
    const { jobId } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        AxiosInstance.get(`api/applications/job/${jobId}/`)
            .then((res) => setApplications(res.data))
            .catch((error) => console.error("Error:", error.response.data));
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