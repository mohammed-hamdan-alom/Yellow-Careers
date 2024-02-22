import React from 'react';
import { useState, useEffect } from 'react';
import '../job_summary/JobSummary.css';
import JobSummary from "../job_summary/JobSummary";
import AxiosInstance from '../../Axios';;

function AppliedJobListPage() {
    //
    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        AxiosInstance.get("api/job-seeker")
            .then((res) => setJobs(res.data))
    }, []);
}

export default AppliedJobListPage;