import React, { useContext, useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import AuthContext from "../../../context/AuthContext";
import AxiosInstance from '../../../Axios';



const JobOpeningsPage = () => {
    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    const [applicants, setApplicants] = useState([]);
    const jobId = 364;

    useEffect(() => {
        AxiosInstance.get(`api/applicants/364/`)
            .then((res) => setApplicants(res.data))
            .catch((error) => console.error("Error:", error.response.data));
    }, []);


    return (
        <div>
            <h1>Matched applicants</h1>
            {applicants.map(applicant => (
                < ul className='job-summary' key={applicant.id} >
                    <h1> {applicant.first_name} </h1>
                </ul>))
            }
        </div >
    )
};

export default JobOpeningsPage;