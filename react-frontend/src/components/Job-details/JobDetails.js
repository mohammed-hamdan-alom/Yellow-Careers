import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { useParams } from 'react-router-dom';
import AxiosInstance from '../../Axios';

function JobDetails () {
    // get the user id from the context
    const { user } = useContext(AuthContext);
    const userId = user.user_id;
    

    const applicationId = 1;  // Replace with your application id

    // get the job id from the url
    const { jobId } = useParams();

    const [job, setJob] = useState({}); // this is for the job details
    const [questions, setQuestions] = useState([]); // this is for the questions
    const [answers, setAnswers] = useState({}); // this is for the answers
    const [resume, setResume] = useState({});   // this is for the resume
    const [address, setAddress] = useState({}); // this is for the address
    const [company, setCompany] = useState({}); // this is for the company

    // get the job details
    useEffect(() => {
        Promise.all([
            AxiosInstance.get(`api/jobs/${jobId}/`),
            AxiosInstance.get(`api/jobs/${jobId}/questions/`),
            AxiosInstance.get(`api/job-seekers/${userId}/resume/`),
            AxiosInstance.get(`api/jobs/${jobId}/address/`),
            AxiosInstance.get(`api/jobs/${jobId}/company/`)
        ]).then((responses) => {
            setJob(responses[0].data);
            setQuestions(responses[1].data);
            setResume(responses[2].data);
            setAddress(responses[3].data);
            setCompany(responses[4].data);
        }).catch((error) => console.error('Error fetching data:', error));
    }, [jobId, userId]);

    // this is for saving an answer
    const handleInputChange = (questionId, newValue) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: newValue,
        }));
    };

    // this is to save the answer to the database
    const createAnswers = (applicationId) => {
        // Send a POST request for each answer
        for (const questionId in answers) {
            AxiosInstance.post(`api/answers/create/`, {
                application: applicationId,  // Replace with your application id
                question: questionId,
                answer: answers[questionId],
            })
            .catch((error) => console.error('Error saving answer:', error));
        }
    };



    const handleApply = () => {
        const applicationData = {
            job_seeker: userId,
            job: jobId,
            resume: resume.id,
        }
        
        AxiosInstance.post('api/applications/create/', applicationData)
        .then((response) => {
            const application = response.data;
            console.log('Created application:', application);

            // The application's ID is now available as application.id
            createAnswers(application.id);
        })
        .catch((error) => console.error('Error creating application:', error));
};

    const handleSave = () => {
        // Add logic to handle applying for the job
        console.log("Saving a job:", jobId);
    };


    return (
        <div>
            <h1>{job.title}</h1>
            <h2>{address.country}</h2>
            <h3>{company.company_name}</h3>
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
            <button onClick={handleSave}>Save</button>
        </div>
    )
}

export default JobDetails;