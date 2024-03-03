import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate  } from 'react-router-dom';
import AuthContext from "../../../context/AuthContext";
import AxiosInstance from '../../../Axios';



const JobOpeningsPage = () => {
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


    return (
        <div>
            <h1>Matched applicants</h1>
            <button onClick={handleClick}> Job Details </button> 
            {applicants.map(applicant => (
                < ul className='job-summary' key={applicant.id} >
                    <h1> {applicant.first_name} </h1>
                </ul>))
            }
        </div >
    )
};

export default JobOpeningsPage;