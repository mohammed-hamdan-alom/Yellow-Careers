import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from "@/utils/AxiosInstance";
import { Input, Button } from 'antd';
import '@/components/styling/button.css';
import StyledQuestion from "@/components/questions_and_answers/Question";
import Swal from 'sweetalert2'; // Import SweetAlert2
import { checkUserIdAndReload } from "@/components/refreshUser/refreshUser"
import { handleErrorAndShowMessage } from '@/components/error_handler/error_display';

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
        const fetchData = async () => {
          try {
            const responses = await Promise.all([
              AxiosInstance.get(`api/jobs/${jobId}/questions/`),
              AxiosInstance.get(`api/job-seeker/${userId}/resume/`)
            ]);
            setQuestions(responses[0].data);
            setResume(responses[1].data);
          } catch (error) {
            checkUserIdAndReload(userId);
            handleErrorAndShowMessage("Error fetching data:", error);
          }
        };
      
        fetchData();
      }, [jobId, userId]);
      
      const createAnswers = async (applicationId) => {
        for (const questionId in answers) {
          try {
            await AxiosInstance.post(`api/answers/create/`, {
              application: applicationId,
              question: questionId,
              answer: answers[questionId],
            });
          } 
          catch (error) {
            handleErrorAndShowMessage("Error creating answers:", error);
          }
        }
        navigate(`/job-seeker/job-details/${jobId}`);
      };
      
      const handleApply = async () => {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Are you sure you want to apply for this job?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#FFD700",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, apply!",
        });
      
        if (result.isConfirmed) {
          const applicationData = {
            job_seeker: userId,
            job: jobId,
            resume: resume.id,
          }
          try {
            const response = await AxiosInstance.post('api/applications/create/', applicationData);
            const application = response.data;
            createAnswers(application.id);
          } catch (error) {
              handleErrorAndShowMessage("Error applying to job:", error);
          }
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
            <Button className="yellowButton large-button" type="primary" onClick={handleApply}>Apply</Button>
          </div>
        </div>
      );
    }

export default JobQuestions;