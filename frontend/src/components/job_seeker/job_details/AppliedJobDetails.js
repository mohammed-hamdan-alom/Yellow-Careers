import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../../context/AuthContext";
import { useParams } from 'react-router-dom';
import axios from '../../../Axios';
import ResumeDisplay from "../resume/ResumeDisplay";

function AppliedJobDetails() {

    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    const { applicationId } = useParams();

    const [application, setApplication] = useState({});
    const [resume, setResume] = useState({});
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});


    useEffect(() => {
        const fetchData = async () => {   
            try {
                const [applicationResponse] = await Promise.all([
                    axios.get(`api/applications/${applicationId}`),
                ]);

                setApplication(applicationResponse.data);

                const [
                    resumeResponse,
                    questionsResponse,
                    answersResponse,
                  ] = await Promise.all([
                    axios.get(`/api/applications/${applicationResponse.data.id}/resume`),
                    axios.get(`/api/jobs/${applicationResponse.data.job}/questions`),
                    axios.get(`/api/applications/${applicationResponse.data.id}/answers`),
                  ]);
          
                  setResume(resumeResponse.data);
                  setQuestions(questionsResponse.data);
                  setAnswers(answersResponse.data);
            } catch (error) {
                console.error('Error retrieving info:', error);
            }
        }

        fetchData();
    }, [applicationId]);

    return (
        <div>
            <h1>Date Applied: {application.date_applied}</h1>
            <br />
            <h2>Resume used: {resume.id}</h2>
            <ResumeDisplay resume={resume} />
            {questions.length > 0 ? (
                <div>
                    <h3>Questions and Answers:</h3>
                    {questions.map((question, index) => (
                        <div key={index}>
                            <p>Question: {question.question}</p>
                            <p>
                                Answer:{" "}
                                {answers.find((answer) => answer.question === question.id)?.answer}
                            </p>
                        </div>
                ))}
                </div>
            ) : (
                <h3>No questions</h3>
            )}
        </div>
    )

}

export default AppliedJobDetails;