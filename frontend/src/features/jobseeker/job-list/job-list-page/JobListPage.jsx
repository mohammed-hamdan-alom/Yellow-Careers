import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import JobFilterList from "../../search/JobFilterList";

const JobListPage = () => {
    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    const [jobs, setJobs] = useState(undefined);
    const [resume, setResume] = useState({});
    const [isJobRetrieved, setIsJobRetrieved] = useState(false);

    useEffect(() => {
        async function fetchData() {
            AxiosInstance.get(`api/job-seeker/${userId}/resume/`)
                .then((response) => {
                    setResume(response.data)
                    if (response.data.id !== undefined) {
                        AxiosInstance.get(`api/job-seeker/${userId}/matched-jobs/`)
                            .then((res) => {
                                setJobs(res.data)
                                setIsJobRetrieved(true);
                                console.log(jobs)
                            }).catch((error) => console.error('Error fetching data:', error));
                    }
                })
        }
        fetchData();
    }, [isJobRetrieved]);

    return (
        <div>
            <h1>Matched jobs</h1>
            <br></br>
            {resume.id && jobs ? <JobFilterList data={jobs} /> :
                <h1>Create a resume first</h1>
            }

        </div >
    )
};

export default JobListPage;