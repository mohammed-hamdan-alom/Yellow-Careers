import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from "@/utils/AxiosInstance";
import { Label } from "@/components/ui/label";
import DisplayResume from "@/components/Resume/DisplayResume";
import QuestionsAndAnswers from "@/components/questions_and_answers/QuestionsAndAnswers";
import { Tag } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import "@/components/styling/tag.css";
import { handleErrorAndShowMessage } from "@/components/handleErrorAndShowMessage/handleErrorAndShowMessage";

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

        const [resumeResponse, questionsResponse, answersResponse] = await Promise.all([
          AxiosInstance.get(`/api/applications/${applicationResponse.data.id}/resume`),
          AxiosInstance.get(`/api/jobs/${applicationResponse.data.job}/questions`),
          AxiosInstance.get(`/api/applications/${applicationResponse.data.id}/answers`),
        ]);

        setResume(resumeResponse.data);
        setQuestions(questionsResponse.data);
        setAnswers(answersResponse.data);
      } catch (error) {
        handleErrorAndShowMessage("Error retrieving data:", error);
        if (error.response && (error.response.status === 403 || error.response.status === 404)) {
          window.location.href = "/job-seeker/dashboard";
        }
      }
    };

    fetchData();
  }, [applicationId]);

  const decisionText =
    application.decision === "A"
      ? "Accepted"
      : application.decision === "R"
        ? "Rejected"
        : "Undecided";

  const decisionColor =
    application.decision === "A"
      ? "success"
      : application.decision === "R"
        ? "error"
        : "processing";

  const decisionIcon =
    application.decision === "A" ? (
      <CheckCircleOutlined />
    ) : application.decision === "R" ? (
      <CloseCircleOutlined />
    ) : (
      <QuestionCircleOutlined />
    );

  return (
    <div>
      <Label className="text-xl font-semibold">
        Date Applied: {application.date_applied} | Status:{" "}
        <Tag className="pulsate tag-medium" icon={decisionIcon} color={decisionColor}>
          {decisionText}
        </Tag>
      </Label>
      <div className="mb-4"></div>
      <DisplayResume resumeId={resume.id} />

      <div className="mb-4"></div>
      {questions.length > 0 ? (
        <div>
          <Label className="text-xl font-semibold mb-4">Questions and Answers:</Label>
          <QuestionsAndAnswers questions={questions} answers={answers} />
        </div>
      ) : (
        <Label className="text-xl font-semibold">No Questions</Label>
      )}
    </div>
  );
}
export default AppliedJobDetails;
