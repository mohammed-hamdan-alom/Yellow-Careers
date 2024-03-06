import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from "../../../context/AuthContext";
import AxiosInstance from '../../../Axios';



const JobApplicantsPage = () => {
    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    const [applicants, setApplicants] = useState([]);
    const { jobId } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        AxiosInstance.get(`api/applicants/${jobId}`)
            .then((res) => setApplicants(res.data))
            .catch((error) => console.error("Error:", error.response.data));
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
            .catch((error) => console.error("Error:", error.response.data));
    }

    return (
        <div>
            <button onClick={handleShowDetails}> Job Details </button>
            <h2>Matched applicants</h2>
            {applicants.map(applicant => (
                <ul key={applicant.id}>
                    <h3>
                        <button onClick={() => handleShowApplication(applicant.id)}> Show Application </button>
                        {applicant.first_name} {applicant.last_name}
                    </h3>
                </ul>
            ))}
        </div>
    )
};

export default JobApplicantsPage;