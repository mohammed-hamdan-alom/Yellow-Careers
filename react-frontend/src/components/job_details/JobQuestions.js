import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from '../../Axios';


function JobQuestions() {
    const { jobId } = useParams();
    const [questions, setQuestions] = useState([]);
  
    useEffect(() => {
      AxiosInstance.get(`api/jobs/${jobId}/questions/`)
        .then((response) => {
          setQuestions(response.data);
        })
        .catch((error) => console.error('Error getting questions:', error));
    }, [jobId]);
  
    return (
      <div>
        <h2>Questions</h2>
        {questions.map((question, index) => (
          <p key={index}>{question}</p>
        ))}
      </div>
    );
  }
  
  export default JobQuestions;