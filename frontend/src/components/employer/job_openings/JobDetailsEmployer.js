import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate  } from 'react-router-dom';
import AuthContext from "../../../context/AuthContext";
import AxiosInstance from '../../../Axios';



const JobDetailsEmployer = () => {
    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    const currentURL = window.location.href;


    // REPLACE ALL 364's WITH JOBID
    const { jobId } = 364;

    const navigate = useNavigate();

    const [job, setJob] = useState({}); 
    const [questions, setQuestions] = useState([]); 
    const [address, setAddress] = useState({});
    const [company, setCompany] = useState({}); 
    const [employers, setEmployers] = useState([]);

    useEffect(() => {
        Promise.all([
            AxiosInstance.get(`api/jobs/364/`), 
            AxiosInstance.get(`api/jobs/364/company/`), 
            AxiosInstance.get(`api/jobs/364/address/`), 
            AxiosInstance.get(`api/jobs/364/questions/`), 
            AxiosInstance.get(`api/job/364/employers/`),
        ]).then((responses) => {
            setJob(responses[0].data);
            setCompany(responses[1].data);
            setAddress(responses[2].data);
            setQuestions(responses[3].data);
            setEmployers(responses[4].data);
        }).catch((error) => console.error('Error fetching data:', error));
    }, [jobId, userId]);

    const handleClick = () => {
        navigate(`/employer/job-openings`);
    }

    return (

        <div>
            <button onClick={handleClick}>See Applicants</button>
            <h1>{job.title}</h1>
            <h2>{job.description}</h2>
            <h3>{company.company_name}</h3>
            <h4>Salary: {job.salary}</h4>
            <h4>Job Type: {job.job_type}</h4>
            <h4><strong>Location:</strong> {address.post_code}, {address.city}, {address.country}</h4>
            <br></br>
            <h4> Employers: </h4>
            {employers.map(employer => (
                < ul className='job-summary' key={employer.id} >
                    <p>{employer.first_name} {employer.last_name}</p>
                </ul>))
            }
        </div>
    )
};

export default JobDetailsEmployer;