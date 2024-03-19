import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from '../../../../components/Alert/Alert';
import { Input, Button, Space } from 'antd';
import '../styling/button.css';
import StyledQuestion from "@/components/Questions/StyledQuestions";
import Swal from 'sweetalert2'; // Import SweetAlert2

function JobQuestions() {
    const { user } = useContext(AuthContext);
    const userId = user.user_id;
    const { jobId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [resume, setResume] = useState({});

    const { TextArea } = Input;

    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            AxiosInstance.get(`api/jobs/${jobId}/questions/`),
            AxiosInstance.get(`api/job-seeker/${userId}/resume/`)
        ]).then((responses) => {
            setQuestions(responses[0].data);
            setResume(responses[1].data);
        }).catch((error) => console.error('Error fetching data:', error));
    }, [jobId, userId]);

    const createAnswers = (applicationId) => {
        for (const questionId in answers) {
            AxiosInstance.post(`api/answers/create/`, {
                application: applicationId,
                question: questionId,
                answer: answers[questionId],
            })
                .then(() => {
                    navigate(`/job-seeker/job-details/${jobId}`);
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

    const handleApply = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Are you sure you want to apply for this job?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#FFD700",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, apply!",
        }).then((result) => {
            if (result.isConfirmed) {
                const applicationData = {
                    job_seeker: userId,
                    job: jobId,
                    resume: resume.id,
                }
                AxiosInstance.post('api/applications/create/', applicationData)
                    .then((response) => {
                        const application = response.data;
                        createAnswers(application.id);
                    })
                    .catch((error) => console.error('Error creating application:', error));
            }
        });
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
              <div className="mt-2">
                <TextArea
                  showCount
                  maxLength={2000}
                  value={answers[question.id] || ''}
                  onChange={e => handleInputChange(question.id, e.target.value)}
                  placeholder="Type your answer here..."
                />
              </div>
              {index !== questions.length - 1 && <div style={{ marginBottom: '25px' }} />}
            </div>
          ))}
          <div style={{ marginTop: '25px' }}>
            <Button className="applyButton" type="primary" onClick={handleApply}>Apply</Button>
          </div>
        </div>
      );
    }

export default JobQuestions;
