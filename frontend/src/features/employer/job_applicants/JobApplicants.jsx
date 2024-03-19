import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import Swal from 'sweetalert2';
import { Label } from '@/components/ui/label';
import { Button, Space } from 'antd';
import './button.css';

const JobApplicantsPage = () => {
    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    const [applicants, setApplicants] = useState([]);
    const { jobId } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        AxiosInstance.get(`api/applicants/${jobId}`)
            .then((res) => setApplicants(res.data))
            .catch((error) => {console.error("Error:", error.response.data);
            if (error.response && (error.response.status === 403 || error.response.status === 404)) {
                window.location.href = "/employer/dashboard";
            }});
    }, []);

    const handleShowDetails = () => {
        navigate(`/employer/job-details/${jobId}`);
    }

    const handleShowApplication = (key) => {
        AxiosInstance.get(`api/applications/${key}/${jobId}`)
            .then((res) => {
                const applicationId = res.data.id;
                navigate(`/employer/application-details/${applicationId}`);
            })
            .catch((error) =>{ console.error("Error:", error.response.data)});
    }

    return (
        <div className="mb-8"> 
            <Button className="viewJobDetailsButton mb-4" onClick={handleShowDetails}>View Job Details</Button> 
            <h2 className="mb-4">Matched Applicants</h2>
            {applicants.map(applicant => (
                <div key={applicant.id} className="applicant-item mb-4">
                    <h3 className="mb-2">
                        <Button onClick={() => handleShowApplication(applicant.id)} className="mr-2">Show Application</Button>
                        <Label>{applicant.first_name} {applicant.last_name}</Label>
                    </h3>
                </div>
            ))}
        </div>
    )
};



export default JobApplicantsPage;