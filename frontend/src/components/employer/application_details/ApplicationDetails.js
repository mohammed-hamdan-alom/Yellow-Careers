import React, { useEffect, useState } from 'react';
import axios from './Axios';
import { useParams } from 'react-router-dom';

const ApplicationDetails = () => {
  const [application, setApplication] = useState({});
  const [jobSeeker, setJobSeeker] = useState({});
  const [resume, setResume] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const applicationId = id;

    axios.get(`/api/applications/${applicationId}`)
      .then(response => {
        setApplication(response.data);
        return response.data.job;
      })
      .then(jobId => {
        axios.get(`/api/jobs/${job}/questions`)
          .then(response => setQuestions(response.data));
      });

    axios.get(`/api/applications/${applicationId}/resume`)
      .then(response => setResume(response.data));

    axios.get(`/api/applications/${applicationId}/answers`)
      .then(response => setAnswers(response.data));
  }, [id]);

  return (
    <div>
      <h1>Application Details</h1>
      <h2>Job Seeker: {jobSeeker.name}</h2>
      <h3>Resume: {resume.title}</h3>
      <h3>Questions and Answers:</h3>
      {questions.map((question, index) => (
        <div key={index}>
          <p>Question: {question.text}</p>
          <p>Answer: {answers[index].text}</p>
        </div>
      ))}
    </div>
  );
};

export default ApplicationDetails;