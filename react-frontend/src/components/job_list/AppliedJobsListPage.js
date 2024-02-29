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
        AxiosInstance.get(`api/job-seeker/${userId}/applied-jobs/`)
            .then((res) => setJobs(res.data))
    }, [userId]);

    return (
        <div>
            <h1>Applied jobs</h1>
            {jobs.map(job => (
                < ul className='job-summary' key={job.id} >
                    <JobSummary job={job} />
                </ul>))
            }
        </div >
    )
};

export default AppliedJobListPage;