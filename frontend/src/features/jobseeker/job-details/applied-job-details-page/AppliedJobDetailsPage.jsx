import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import AxiosInstance from "@/utils/AxiosInstance";
import { Label } from '@/components/ui/label';
import DisplayResume from "@/components/resume/DisplayResume";
import QuestionsAndAnswers from "@/components/questions_and_answers/QuestionsAndAnswers";

function AppliedJobDetails() {

    const { applicationId } = useParams();

    const [application, setApplication] = useState({});
    const [resume, setResume] = useState({});
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [applicationResponse] = await Promise.all([
                    AxiosInstance.get(`api/applications/${applicationId}`),
                ]);

                setApplication(applicationResponse.data);

                const [
                    resumeResponse,
                    questionsResponse,
                    answersResponse,
                ] = await Promise.all([
                    AxiosInstance.get(`/api/applications/${applicationResponse.data.id}/resume`),
                    AxiosInstance.get(`/api/jobs/${applicationResponse.data.job}/questions`),
                    AxiosInstance.get(`/api/applications/${applicationResponse.data.id}/answers`),
                ]);

                setResume(resumeResponse.data);
                setQuestions(questionsResponse.data);
                setAnswers(answersResponse.data);
            } catch (error) {
                console.error('Error retrieving info:', error);
                if (error.response && (error.response.status === 403 || error.response.status === 404)) {
                    window.location.href = "/job-seeker/dashboard";
                }
            }
        }

        fetchData();
    }, [applicationId]);

    return (
        <div>
            <h1>Date Applied: {application.date_applied}</h1>
            <br />
            <h2>Resume:</h2>
            <DisplayResume resumeId={resume.id} />

            {questions.length > 0 ? (
                <div>
                    <Label className="text-xl font-semibold">Questions and Answers:</Label>
                    <QuestionsAndAnswers questions={questions} answers={answers} />
                </div>
            ) : (
                <Label className="text-xl font-semibold">No Questions</Label>
            )}
        </div>
    )
}

export default AppliedJobDetails;
