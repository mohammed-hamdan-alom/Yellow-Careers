import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
// import '../job_summary/JobSummary.css';
import JobSummary from "../../summary/JobSummary";
import AxiosInstance from "@/utils/AxiosInstance";

function SavedJobListPage() {
    // get the user id from the context
    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    // get the saved jobs of the job seeker
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        AxiosInstance.get(`api/job-seeker/${userId}/saved-jobs/`)
            .then((res) => setJobs(res.data))
    }, [userId]);

    // display the saved jobs
    return (
        <div>
            <h1>Saved Jobs:</h1>
            {jobs.map(job => (
                < ul className='job-summary' key={job.id} >
                    <JobSummary job={job} />
                </ul>))
            }
        </div>
    )
}

export default SavedJobListPage;