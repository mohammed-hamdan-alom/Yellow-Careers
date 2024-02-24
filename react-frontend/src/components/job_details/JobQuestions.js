import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from '../../Axios';


function JobQuestions() {
    const { jobId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // this is for the answers
  
    useEffect(() => {
      AxiosInstance.get(`api/jobs/${jobId}/questions/`)
        .then((response) => {
          setQuestions(response.data);
        })
        .catch((error) => console.error('Error getting questions:', error));
    }, [jobId]);


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
      </div>
    );
  }
  
  export default JobQuestions;