import React from 'react';
import { useState, useEffect } from 'react';
import '../job_summary/JobSummary.css';
import JobSummary from "../job_summary/JobSummary";
import AxiosInstance from '../../Axios';;


const JobListPage = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        AxiosInstance.get("api/jobs/all-jobs")
            .then((res) => setJobs(res.data))
    }, []);


    return (
        <div>
            <h1>Matched jobs</h1>
            <ul className='job-summary'>
                {jobs.map(job => (
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