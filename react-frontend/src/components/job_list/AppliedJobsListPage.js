import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import '../job_summary/JobSummary.css';
import JobSummary from "../job_summary/JobSummary";
import AxiosInstance from '../../Axios';;

function AppliedJobListPage() {
    //
    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        AxiosInstance.get(`api/job-seekers/${userId}/applied-jobs/`)
            .then((res) => setJobs(res.data))
    }, [userId]);

    return (
        <div>
            <h1>Applied Jobs:</h1>
            <ul className='job-summary'>
                {jobs.map(job => (
                    <JobSummary job={job} />
                ))}
            </ul>
        </div>
    )
}

export default AppliedJobListPage;