import React from 'react';
import { useState, useEffect } from 'react';
import JobSummary from "../job_summary/JobSummary";
import AxiosInstance from '../../Axios';
import JobSearchBar from '../searchbar/JobSearchBar';

const JobListPage = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        AxiosInstance.get("api/jobs/all-jobs")
            .then((res) => {
                setJobs(res.data)
            })
    }, []);

    return (
        <div>
            <h1>All jobs</h1>
            <JobSearchBar database={jobs} />
        </div>
    )
};

export default JobListPage;