import React, { useContext, useState, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import { useParams } from 'react-router-dom';
import AxiosInstance from "@/utils/AxiosInstance";
import DisplayEducation from "@/features/employer/application_details/DisplayEducation";
import DisplayLanguages from "@/features/employer/application_details/DisplayLanguages";
import DisplayProfessionalExperience from "@/features/employer/application_details/DisplayProfessionalExperience";
import DisplayResume from "@/features/employer/application_details/DisplayResume";
import DisplaySoftSkills from "@/features/employer/application_details/DisplaySoftSkills";
import DisplayTechnicalSkills from "@/features/employer/application_details/DisplayTechnicalSkills";
import StyledAnswers from "@/components/Questions/StyledAnswers";
import { Label } from '@/components/ui/label';

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
            <DisplaySoftSkills resumeId={resume.id} />
            <DisplayTechnicalSkills resumeId={resume.id} />
            <DisplayLanguages resumeId={resume.id} />
            <DisplayEducation resumeId={resume.id} />
            <DisplayProfessionalExperience resumeId={resume.id} />

            {questions.length > 0 ? (
                <div>
                    <Label className="text-xl font-semibold">Questions and Answers:</Label>
                    <StyledAnswers questions={questions} answers={answers} />
                </div>
            ) : (
                <Label className="text-xl font-semibold">No Questions:</Label>
            )}
        </div>
    )
}

export default AppliedJobDetails;
