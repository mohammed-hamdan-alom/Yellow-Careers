import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../../context/AuthContext";
import '../job_summary/JobSummary.css';
import { useParams } from 'react-router-dom';
import JobSummary from "../job_summary/JobSummary";
import AxiosInstance from '../../../Axios';


const JobListPage = () => {
    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    const [jobs, setJobs] = useState([]);
    const [resume, setResume] = useState({});

    useEffect(() => {
        AxiosInstance.get(`api/job-seeker/${userId}/resume/`)
            .then((response) => {
                setResume(response.data)
                console.log(response.data.id)
            })
        if (resume.id !== undefined) {
            AxiosInstance.get(`api/job-seeker/${userId}/matched-jobs/`)
                .then((res) => setJobs(res.data))
                .catch((error) => console.error("Error:", error.response.data));
        }
    }, []);


    return (
        <div>
            <h1>Matched jobs</h1>
            <br></br>
            {resume.id == undefined ? <h1>Create a resume first</h1> :
                jobs.map(job => (
                    < ul className='job-summary' key={job.id} >
                        <JobSummary job={job} />
                    </ul>))
            }

        </div >
    )
};

export default JobListPage;