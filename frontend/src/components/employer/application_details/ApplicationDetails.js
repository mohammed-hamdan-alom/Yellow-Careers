import React, { useEffect, useState } from "react";
import axios from "../../../Axios";
import { useParams } from "react-router-dom";
import DisplayResume from "./DisplayResume";
import DisplaySoftSkills from "./DisplaySoftSkills";
import DisplayTechnicalSkills from "./DisplayTechnicalSkills";
import DisplayLanguages from "./DisplayLanguages";
import DisplayEduction from "./DisplayEduction";
import DisplayProfessionalExperience from "./DisplayProfessionalExperience";

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
        const applicationResponse = await axios.get(
          `/api/applications/${applicationId}`
        );
        setApplication(applicationResponse.data);

        const [
          jobSeekerResponse,
          questionsResponse,
          resumeResponse,
          answersResponse,
        ] = await Promise.all([
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
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [applicationId]);

  const markAsRead = async () => {
    let newStatus = application.status === "R" ? "U" : "R"; // Toggle between "R" and "U"

    try {
      // React ensures that it receives the latest state as an argument.
      setApplication((prevApplication) => ({
        ...prevApplication,
        status: newStatus,
      }));
      await axios.put(`/api/applications/${applicationId}/update/`, {
        ...application,
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

      await axios.put(`/api/applications/${applicationId}/update/`, {
        ...application,
      });
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  };

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

      <h2>Resume!</h2>
      <DisplayResume resumeId={resume.id} />
      <DisplaySoftSkills resumeId={resume.id} />
      <DisplayTechnicalSkills resumeId={resume.id} />
      <DisplayLanguages resumeId={resume.id} />
      <DisplayEduction resumeId={resume.id} />
      <DisplayProfessionalExperience resumeId={resume.id} />

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

      {/* <button onClick={markAsRead}>Mark as Read</button> */}
      <button onClick={markAsRead}>
        {application.status === "R"
          ? "Mark Application as Unread"
          : "Mark Application as Read"}
      </button>

      <select value={application.decision} onChange={handleDecisionChange}>
        <option value="A">Accepted</option>
        <option value="R">Rejected</option>
        <option value="U">Undecided</option>
      </select>
      <div>Read Val: {application.status}</div>
      <div>Decision: {application.decision}</div>
    </div>
  );
};

export default ApplicationDetails;
