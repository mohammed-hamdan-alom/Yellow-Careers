import React from 'react';
import { useState, useEffect } from 'react';
import './JobListPage.css';
import JobSummary from "../job_summary/JobSummary";
import AxiosInstance from '../../Axios';;


const JobListPage = () => {
    const [job, setJob] = useState([]);

    useEffect(() => {
        AxiosInstance.get("api/jobs/all-jobs")
            .then((res) => setJob(res.data))
    }, []);

    return (
        <div>
            <h1>All jobs</h1>
            <ul className='job-summary'>
                {job.map(job => (
                    <JobSummary
                        key={job.id}
                        id={job.id}
                        title={job.title}
                        hirer={job.hirer}
                        description={job.description}
                        location={job.address}
                    />
                ))}
            </ul>
        </div>
    )
};

export default JobListPage;