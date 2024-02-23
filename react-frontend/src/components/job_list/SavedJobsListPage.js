import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import '../job_summary/JobSummary.css';
import JobSummary from "../job_summary/JobSummary";
import AxiosInstance from '../../Axios';;

function SavedJobListPage() {
    // get the user id from the context
    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    // get the saved jobs of the job seeker
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        AxiosInstance.get(`api/job-seekers/${userId}/saved-jobs/`)
            .then((res) => setJobs(res.data))
    }, [userId]);

    // display the saved jobs
    return (
        <div>
            <h1>Saved Jobs:</h1>
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
}

export default SavedJobListPage;