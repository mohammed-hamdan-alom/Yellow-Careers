import React, { useEffect, useState } from 'react';
import axios from '../../../Axios';
import { useParams } from 'react-router-dom';

const ApplicationDetails = () => {
  const [application, setApplication] = useState({});
  const [jobSeeker, setJobSeeker] = useState({});
  const [resume, setResume] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const { applicationId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const applicationResponse = await axios.get(`/api/applications/${applicationId}`);
        setApplication(applicationResponse.data);

        const [jobSeekerResponse, questionsResponse, resumeResponse, answersResponse] = await Promise.all([
          axios.get(`/api/job-seekers/${applicationResponse.data.job_seeker}`),
          axios.get(`/api/jobs/${applicationResponse.data.job}/questions`),
          axios.get(`/api/applications/${applicationId}/resume`),
          axios.get(`/api/applications/${applicationId}/answers`),
        ]);

        setJobSeeker(jobSeekerResponse.data);
        setQuestions(questionsResponse.data);
        setResume(resumeResponse.data);
        setAnswers(answersResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [applicationId]);

  return (
    <div>
      <h1>Application Details</h1>
      <h2>Job Seeker: {jobSeeker.first_name + jobSeeker.last_name}</h2>
      <p>Date of Birth: {jobSeeker.dob}</p>
      <h3>Address:</h3>
      {/* <p>City: {jobSeeker.address.city}</p>
      <p>Post Code: {jobSeeker.address.post_code}</p>
      <p>Country: {jobSeeker.address.country}</p> */}
      <p>Nationality: {jobSeeker.nationality}</p>
      <p>Sex: {jobSeeker.sex}</p>
      <h3>Resume: {resume.about}</h3>
      <h3>Questions and Answers:</h3>
      {questions.map((question, index) => (
        <div key={index}>
          <p>Question: {question.text}</p>
          <p>Answer: {answers.find(answer => answer.question === question.id)?.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ApplicationDetails;