import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from '../../Axios';
import ResumeDisplay from "../resume/ResumeDisplay";

function AppliedJobDetails() {

    const { user } = useContext(AuthContext);
    const userId = user.user_id;

    const { jobId } = useParams();

    const navigate = useNavigate();

    const [job, setJob] = useState({});
    const [application, setApplication] = useState({});
    const [resume, setResume] = useState({});
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});


    useEffect(() => {
        Promise.all([
            AxiosInstance.get(`api/jobs/${jobId}/`),
            AxiosInstance.get(`api/applications/${userId}/${jobId}`),
        ]).then((responses) => {
            setJob(responses[0].data);
            setApplication(responses[1].data);
            AxiosInstance.get(`api/applications/${responses[1].data.id}/resume/`)
                .then(response => setResume(response.data));
                AxiosInstance.get(`api/jobs/${jobId}/questions/`)
                    .then(response => {
                        setQuestions(response.data);
                        const answerPromises = response.data.map(question =>
                            AxiosInstance.get(`api/questions/${question.id}/answers/`)
                                .then(response => ({ [question.id]: response.data[0].answer }))
                        );
                        return Promise.all(answerPromises);
                    })
                    .then(answerObjects => {
                        const newAnswers = Object.assign({}, ...answerObjects);
                        setAnswers(newAnswers);
                    });
        })
            .catch((error) => console.error('Error retrieving info:', error));
    }, [jobId, userId]);

    return (
        <div>
            <h1>Date Applied: {application.date_applied}</h1>
            <br />
            <h2>Resume used: {resume.id}</h2>
            <ResumeDisplay resume={resume} />
            {questions.length > 0 ? (
                <div>
                    <h3>Questions:</h3>
                    {questions.map(question => (
                        <div key={question.id}>
                            <h4>Question: {question.question}</h4>
                            <h5>Answer: {answers[question.id]}</h5>
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