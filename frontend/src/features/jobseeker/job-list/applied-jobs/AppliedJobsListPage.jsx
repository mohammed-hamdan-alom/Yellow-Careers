import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import JobSummary from "../../summary/JobSummary";
import AxiosInstance from "@/utils/AxiosInstance";

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
            {jobs.map(job => (
                < ul className='job-summary' key={job.id} >
                    <JobSummary job={job} />
                </ul>))
            }
        </div >
    )
};

export default AppliedJobListPage;