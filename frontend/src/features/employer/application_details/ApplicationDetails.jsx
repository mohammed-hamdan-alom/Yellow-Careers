import React, { useEffect, useState } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { useParams } from "react-router-dom";
import { Label } from '@/components/ui/label';
import DisplayResume from "@/components/resume/DisplayResume";
import QuestionsAndAnswers from "@/components/questions_and_answers/QuestionsAndAnswers";

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
        const applicationResponse = await AxiosInstance.get(
          `/api/applications/${applicationId}`
        );
        setApplication(applicationResponse.data);

        const [
          jobSeekerResponse,
          questionsResponse,
          resumeResponse,
          answersResponse,
        ] = await Promise.all([
          AxiosInstance.get(`/api/job-seekers/${applicationResponse.data.job_seeker}`),
          AxiosInstance.get(`/api/jobs/${applicationResponse.data.job}/questions`),
          AxiosInstance.get(`/api/applications/${applicationId}/resume`),
          AxiosInstance.get(`/api/applications/${applicationId}/answers`),
        ]);

        setJobSeeker(jobSeekerResponse.data);
        setQuestions(questionsResponse.data);
        setResume(resumeResponse.data);
        setAnswers(answersResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        if (error.response && (error.response.status === 403 || error.response.status === 404)) {
          window.location.href = "/employer/dashboard";
      }
      }
    };

    fetchData();
  }, [applicationId]);
  
  const markAsRead = async () => {
    let newStatus = application.status === "R" ? "U" : "R";

    try {
      setApplication((prevApplication) => ({
        ...prevApplication,
        status: newStatus,
      }));
      await AxiosInstance.put(`/api/applications/${applicationId}/update/`, {
        ...application,
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to mark application as read:", error);
    }
  };

  const handleDecisionChange = async (event) => {
    try {
      setApplication((prevApplication) => ({
        ...prevApplication,
        decision: event.target.value,
      }));

      await AxiosInstance.put(`/api/applications/${applicationId}/update/`, {
        ...application,
        decision: event.target.value,
      });
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1>Application Details</h1>
        <button onClick={markAsRead}>
          {application.status === "R"
            ? "Mark Application as Unread"
            : "Mark Application as Read"}
        </button>
      </div>

      <h2>Job Seeker: {jobSeeker.first_name + jobSeeker.last_name}</h2>
      <p>Date of Birth: {jobSeeker.dob}</p>
      <p>Nationality: {jobSeeker.nationality}</p>
      <p>Sex: {jobSeeker.sex}</p>
      <h3>Address:</h3>
      <p>City: {jobSeeker.address?.city}</p>
      <p>Post Code: {jobSeeker.address?.post_code}</p>
      <p>Country: {jobSeeker.address?.country}</p>

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

      <h3>Decision:</h3>
      <select value={application.decision} onChange={handleDecisionChange}>
        <option value="A">Accepted</option>
        <option value="R">Rejected</option>
        <option value="U">Undecided</option>
      </select>
    </div>
  );
};

export default ApplicationDetails;
