import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from '../../Axios';


function JobQuestions() {
    const { user } = useContext(AuthContext);
    const userId = user.user_id;
    const { jobId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // this is for the answers
    const [resume, setResume] = useState({});   // this is for the resume

    const navigate = useNavigate();
  
    useEffect(() => {
        Promise.all([
            AxiosInstance.get(`api/jobs/${jobId}/questions/`), // get the questions for the job
            AxiosInstance.get(`api/job-seeker/${userId}/resume/`) // get the resume data of the job seeker
        ]).then((responses) => {
            setQuestions(responses[0].data);
            setResume(responses[1].data);
        }).catch((error) => console.error('Error fetching data:', error));
    }, [jobId, userId]);


    const createAnswers = (applicationId) => {
        // send a POST request for each answer
        for (const questionId in answers) {
            AxiosInstance.post(`api/answers/create/`, {
                application: applicationId,  
                question: questionId,
                answer: answers[questionId],
            })
            .then(() => {
                navigate(`/job-seeker/job-details/${jobId}`); // will change to see application details
            })
            .catch((error) => console.error('Error saving answer:', error));
        }
    };

        // this is for applying for the job
    const handleApply = () => {
        if (window.confirm('Are you sure you want to apply for this job?')) {
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
    };



    const handleInputChange = (questionId, newValue) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: newValue,
        }));
    };
    
    return (
      <div>
        <h2>Questions</h2>
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
      </div>
    );
  }
  
  export default JobQuestions;