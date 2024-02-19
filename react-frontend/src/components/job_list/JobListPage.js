import React from 'react';
import { useState, useEffect } from 'react';
import '../job_summary/JobSummary.css';
import JobSummary from "../job_summary/JobSummary";
import AxiosInstance from '../../Axios';
import SearchDatabase from '../searchbar/SearchBar';

const JobListPage = () => {
    const [jobs, setJobs] = useState([]);
    const [address, setAddress] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    function GetLocation(id) {
        const current = address.find(address => address.id === id)
        if (current != undefined) {
            return current.city + ", " + current.country
        }
        return ""
    }

    useEffect(() => {
        AxiosInstance.get("api/jobs/all-jobs")
            .then((res) => {
                setJobs(res.data)
                setSearchResults(res.data)
            })
        AxiosInstance.get("api/addresses/")
            .then((res) => setAddress(res.data))
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <h1>All jobs</h1>
            <SearchDatabase onSearch={handleSearch} />
            <ul className='job-summary'>
                {jobs.map(job => (
                    <JobSummary
                        key={job.id}
                        id={job.id}
                        title={job.title}
                        hirer={job.hirer}
                        description={job.description}
                        location={GetLocation(job.address)}
                    />
                ))}
            </ul>
        </div>
    )
};

export default JobListPage;