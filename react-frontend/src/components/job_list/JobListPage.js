import React from 'react';
import { useState, useEffect } from 'react';
import '../job_summary/JobSummary.css';
import JobSummary from "../job_summary/JobSummary";
import AxiosInstance from '../../Axios';
import SearchBar from '../searchbar/SearchBar';

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
            <SearchBar database={jobs} />
        </div>
    )
};

export default JobListPage;