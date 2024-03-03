import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from "../../../context/AuthContext";
import AxiosInstance from '../../../Axios';



const JobOpeningsPage = () => {
    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    const [applicants, setApplicants] = useState([]);
    const jobId = 1; //THIS NEEDS TO BE CHANGED

    const navigate = useNavigate();

    useEffect(() => {
        AxiosInstance.get(`api/applicants/${jobId}`)
            .then((res) => setApplicants(res.data))
            .catch((error) => console.error("Error:", error.response.data));
    }, []);

    const handleClick = () => {
        navigate(`/employer/job-details/${jobId}`);
    }


    return (
        <div>
            <button onClick={handleClick}> Job Details </button>
            <h2>Matched applicants</h2>
            {applicants.map(applicant => (
                < ul key={applicant.id} >
                    <h3> {applicant.first_name} </h3>
                </ul>))
            }
        </div >
    )
};

export default JobOpeningsPage;