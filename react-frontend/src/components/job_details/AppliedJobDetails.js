import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from '../../Axios';
import ResumeDisplay from "../resume/ResumeDisplay";

function AppliedJobDetails() {

    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    const { jobId } = useParams();

    const navigate = useNavigate();

    const [job, setJob] = useState({});
    const [application, setApplication] = useState({});
    const [resume, setResume] = useState({});


    useEffect(() => {
        Promise.all([
            AxiosInstance.get(`api/jobs/${jobId}/`),
            AxiosInstance.get(`api/applications/${userId}/${jobId}`)
        ]).then((responses) => {
            setJob(responses[0].data);
            setApplication(responses[1].data);
            AxiosInstance.get(`api/applications/${responses[1].data.id}/resume/`)
                .then(response => setResume(response.data));
        })
            .catch((error) => console.error('Error retrieving info:', error));
    }, [jobId, userId]);

    return (
        <div>
            <h1>Date Applied: {application.date_applied}</h1>
            <br />
            <h2>Resume used: {resume.id}</h2>
            <ResumeDisplay resume={resume} />
        </div>
    )

}

export default AppliedJobDetails;