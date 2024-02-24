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
    const [questions, setQuestions] = useState([]); // this is for the questions
    const [answers, setAnswers] = useState({}); // this is for the answers
    const [resume, setResume] = useState({});   // this is for the resume
    const [address, setAddress] = useState({}); // this is for the address
    const [company, setCompany] = useState({}); // this is for the company

    useEffect(() => {
        Promise.all([
            AxiosInstance.get(`api/jobs/${jobId}/`), // get the job details
            AxiosInstance.get(`api/jobs/${jobId}/questions/`), // get the questions for the job
            AxiosInstance.get(`api/job-seeker/${userId}/resume/`), // get the resume data of the job seeker
            AxiosInstance.get(`api/jobs/${jobId}/address/`), // get the address data of the job
            AxiosInstance.get(`api/jobs/${jobId}/company/`) // get the company data of the job
        ]).then((responses) => {
            setJob(responses[0].data);
            setQuestions(responses[1].data);
            setResume(responses[2].data);
            setAddress(responses[3].data);
            setCompany(responses[4].data);
        }).catch((error) => console.error('Error fetching data:', error));
    }, [jobId, userId]);

    useEffect(() => {
        AxiosInstance.get(`api/job-seeker/${userId}/saved-jobs/`)
            .then((res) => {
                setSavedJobs(res.data);
                setIsJobSaved(res.data.some(savedJob => String(savedJob.id) === String(jobId)))
        }).catch((error) => console.error('Error fetching data:', error)); // check if the job is saved
    }, [isJobSaved]);

    // this is for saving an answer
    const handleInputChange = (questionId, newValue) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: newValue,
        }));
    };

    // this is to save the answer to the database
    const createAnswers = (applicationId) => {
        // send a POST request for each answer
        for (const questionId in answers) {
            AxiosInstance.post(`api/answers/create/`, {
                application: applicationId,  
                question: questionId,
                answer: answers[questionId],
            })
            .catch((error) => console.error('Error saving answer:', error));
        }
    };


    // this is for applying for the job
    const handleApply = () => {
        if(questions.length === 0) {
            const applicationData = {
                job_seeker: userId,
                job: jobId,
                resume: resume.id,
            }
            
            // send a POST request to create the application
            AxiosInstance.post('api/applications/create/', applicationData)
            .then((response) => {
                const application = response.data;
                console.log('Created application:', application);

                // the application's ID is now available as application.id
                createAnswers(application.id);
            })
            .catch((error) => console.error('Error creating application:', error));
        }

        else {
            navigate(`job-seeker/job-details/${jobId}/questions/`)
        }
    };

    const handleSave = () => {
        const savedJob = savedJobs.find(savedJob => String(savedJob.id) === String(jobId));
        console.log('Saved job:', savedJob);
        if (savedJob) {
            // If the job is already saved, unsave it
            AxiosInstance.delete(`api/saved-jobs/update/${userId}/${jobId}/`)
                .then(() => {
                    // Remove the unsaved job from the state
                    setIsJobSaved(false);
                })
                .catch((error) => console.error('Error unsaving job:', error));
        } else {
            // If the job is not saved, save it
            AxiosInstance.post(`api/saved-jobs/create/`, {
                job_seeker: userId,
                job: jobId,
            })
            .then((response) => {
                // Add the saved job to the state
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
            {/* dispay each question and allow an answer */}
            {questions.map((question) => (
                <div key={question.id}>
                    <h4>{question.question}</h4>
                    <input
                        type="text"
                        value={answers[question.id] || ''}
                        onChange={e => handleInputChange(question.id, e.target.value)}
                    />
                </div>
            ))}
            <button onClick={handleApply}>Apply</button>
            {isJobSaved ? (
                <button onClick={handleSave}>Unsave</button>
            ) : (
                <button onClick={handleSave}>Save</button>
            )}
        </div>
    )
}

export default JobDetails;