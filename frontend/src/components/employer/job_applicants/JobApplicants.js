import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from "../../../context/AuthContext";
import AxiosInstance from '../../../Axios';



const JobApplicantsPage = () => {
    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    const [applicants, setApplicants] = useState([]);
    const jobId = 364; //THIS NEEDS TO BE CHANGED

    const navigate = useNavigate();

    useEffect(() => {
        AxiosInstance.get(`api/applicants/${jobId}`)
            .then((res) => setApplicants(res.data))
            .catch((error) => console.error("Error:", error.response.data));
    }, []);

    const handleClick = () => {
        navigate(`/employer/job-details/${jobId}`);
    }

    const handleClick2 = () => {
        navigate(`/employer/job-dsdfwdf/jobseekerId`);
    }


    return (
        <div>
            <button onClick={handleClick}> Job Details </button>
            <h2>Matched applicants</h2>
            {applicants.map(applicant => (
                < ul key={applicant.id} >
                    <h3> 
                        <button onClick = {handleClick2}> Show Application </button>
                        {applicant.first_name} {applicant.last_name}
                        </h3>
                </ul>))
            }
        </div >
    )
};

export default JobApplicantsPage;