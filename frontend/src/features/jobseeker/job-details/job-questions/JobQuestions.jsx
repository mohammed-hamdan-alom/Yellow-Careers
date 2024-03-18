import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from '../../../../components/Alert/Alert';
import { Input, Button, Space } from 'antd'; // Import Input and Button from Ant Design
import '../styling/button.css';
import StyledQuestion from "@/components/Questions/StyledQuestions";

function JobQuestions() {
    const { user } = useContext(AuthContext);
    const userId = user.user_id;
    const { jobId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // this is for the answers
    const [resume, setResume] = useState({});   // this is for the resume

    const { TextArea } = Input; // Destructure TextArea from Input

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
                .catch((error) => {
                    if (error.response) {
                        error.response.json().then(data => {
                            let errorMessage = '';
                            for (let key in data) {
                                if (data.hasOwnProperty(key) && Array.isArray(data[key])) {
                                    errorMessage += `${key}: ${data[key].join(', ')}\n`;
                                }
                            }
                            showError(errorMessage);
                        });
                    }
                });
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
          <h2 style={{ fontWeight: 'bold', marginBottom: '5px' }}>Questions</h2>
          {questions.map((question, index) => (
            <div key={question.id}>
              <StyledQuestion question={question.question} />
              <div className="mt-2"> {/* Add margin top for spacing */}
                <TextArea
                  showCount
                  maxLength={2000} // Maximum length of 2000 characters
                  value={answers[question.id] || ''}
                  onChange={e => handleInputChange(question.id, e.target.value)}
                  placeholder="Type your answer here..."
                />
              </div>
              {index !== questions.length - 1 && <div style={{ marginBottom: '25px' }} />} {/* Add space between questions */}
            </div>
          ))}
          <div style={{ marginTop: '25px' }}> {/* Add space above the button */}
            <Button className="applyButton" type="primary" onClick={handleApply}>Apply</Button>
          </div>
        </div>
      );
    }

export default JobQuestions;