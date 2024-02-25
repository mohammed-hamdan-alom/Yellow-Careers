import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from '../../Axios';

function JobDetails () {
    // get the user id from the context
    const { user } = useContext(AuthContext);
    const userId = user.user_id;


    // get the job id from the url
    const { jobId } = useParams();

    const navigate = useNavigate();

    const [job, setJob] = useState({}); // this is for the job details
    const [savedJobs, setSavedJobs] = useState([]); // this is for the saved jobs
    const [isJobSaved, setIsJobSaved] = useState(false); // add state for isJobSaved
    const [appliedJobs, setAppliedJobs] = useState([]); // this is for the applied jobs
    const [isJobApplied, setIsJobApplied] = useState(false); // add state for isJobApplied
    const [questions, setQuestions] = useState([]); // this is for the questions
    const [answers, setAnswers] = useState({}); // this is for the answers
    const [resume, setResume] = useState({});   // this is for the resume
    const [address, setAddress] = useState({}); // this is for the address
    const [company, setCompany] = useState({}); // this is for the company

    useEffect(() => {
        Promise.all([
            AxiosInstance.get(`api/jobs/${jobId}/`), // get the job details
            AxiosInstance.get(`api/jobs/${jobId}/company/`), // get the company data of the job
            AxiosInstance.get(`api/jobs/${jobId}/address/`), // get the address data of the job
            AxiosInstance.get(`api/jobs/${jobId}/questions/`), // get the questions for the job
            AxiosInstance.get(`api/job-seeker/${userId}/resume/`), // get the resume data of the job seeker
            AxiosInstance.get(`api/job-seeker/${userId}/applied-jobs/`), // get the applied jobs of the job seeker
        ]).then((responses) => {
            setJob(responses[0].data);
            setCompany(responses[1].data);
            setAddress(responses[2].data);
            setQuestions(responses[3].data);
            setResume(responses[4].data);
            setAppliedJobs(responses[5].data);
            setIsJobApplied(responses[5].data.some(appliedJob => String(appliedJob.id) === String(jobId)));
        }).catch((error) => console.error('Error fetching data:', error));
    }, [jobId, userId]);

    // check if the job is saved
    useEffect(() => {
        AxiosInstance.get(`api/job-seeker/${userId}/saved-jobs/`)
            .then((res) => {
                setSavedJobs(res.data);
                setIsJobSaved(res.data.some(savedJob => String(savedJob.id) === String(jobId)));
        }).catch((error) => console.error('Error fetching data:', error));
    }, [isJobSaved]);

    // this is for applying for the job
    const handleApply = () => {
        if(questions.length === 0) {
            if (window.confirm('There are no job specific questions. Are you sure you want to apply for this job?')) {
                const applicationData = {
                    job_seeker: userId,
                    job: jobId,
                    resume: resume.id,
                }
                
                // send a POST request to create the application
                AxiosInstance.post('api/applications/create/', applicationData)
                .then(() => {
                    navigate(`/job-seeker/job-details/${jobId}`); // will change to see application details
                })
                .catch((error) => console.error('Error creating application:', error));
            }}

        else {
            navigate(`questions/`)
        }
    };

    const handleSeeApplication = () => {
        console.log('see application');
    };

    const handleSave = () => {
        const savedJob = savedJobs.find(savedJob => String(savedJob.id) === String(jobId));
        if (savedJob) {
            // if the job is already saved, unsave it
            AxiosInstance.delete(`api/saved-jobs/update/${userId}/${jobId}/`)
                .then(() => {
                    // set the state to false
                    setIsJobSaved(false);
                })
                .catch((error) => console.error('Error unsaving job:', error));
        } else {
            // if the job is not saved, save it
            AxiosInstance.post(`api/saved-jobs/create/`, {
                job_seeker: userId,
                job: jobId,
            })
            .then(() => {
                // set the state to true
                setIsJobSaved(true);
            })
            .catch((error) => console.error('Error saving job:', error));
        }
    };
    
    return (
        <div>
            <h1>{job.title}</h1>
            <h2>{address.country}</h2>
            <h3>{company.company_name}</h3>
            {isJobApplied ? (
                <button onClick={handleSeeApplication}>See Application</button>
            ) : (
                <button onClick={handleApply}>Apply</button>
            )}
            {isJobSaved ? (
                <button onClick={handleSave}>Unsave</button>
            ) : (
                <button onClick={handleSave}>Save</button>
            )}
        </div>
    )
}

export default JobDetails;