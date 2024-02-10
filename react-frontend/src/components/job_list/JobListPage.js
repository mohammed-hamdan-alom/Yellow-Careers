import React from 'react';
import { useNavigate } from 'react-router-dom';
import './JobList.css';
import axios from 'axios';
import JobSummary from "../job_summary/JobSummary";

const JobListPage = () => {

}


return (
    <div>
        <button type="button" onClick="{handleClick}">
            Get jobs
        </button>
        <ul>
            {result.map((result) => <h1>{result.data}</h1>)}
        </ul>
    </div>
)

export default JobListPage;