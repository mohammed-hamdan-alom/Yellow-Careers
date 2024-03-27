import React, { useEffect, useState } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Button, Select } from "antd";
import "@/components/styling/button.css";
import Swal from "sweetalert2";
import DisplayResume from "@/components/Resume/DisplayResume";
import QuestionsAndAnswers from "@/components/QuestionsAndAnswers/QuestionsAndAnswers";

const ApplicationDetailsPage = () => {
  const [application, setApplication] = useState({});
  const [jobSeeker, setJobSeeker] = useState({});
  const [resume, setResume] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const { applicationId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const applicationResponse = await AxiosInstance.get(`/api/applications/${applicationId}`);
        setApplication(applicationResponse.data);

        const [jobSeekerResponse, questionsResponse, resumeResponse, answersResponse] =
          await Promise.all([
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

  const handleDecisionChange = async (value) => {
    let confirmationText = "";
    if (value === "A") {
      confirmationText = "Are you sure you want to accept this application?";
    } else if (value === "R") {
      confirmationText = "Are you sure you want to reject this application?";
    } else {
      confirmationText = "Are you sure you want to set this application to undecided?";
    }

    const confirmed = await Swal.fire({
      title: "Confirmation",
      text: confirmationText,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    });

    if (confirmed.isConfirmed) {
      try {
        setApplication((prevApplication) => ({
          ...prevApplication,
          decision: value,
        }));

        await AxiosInstance.put(`/api/applications/${applicationId}/update/`, {
          ...application,
          decision: value,
        });
      } catch (error) {
        console.error("Failed to update application status:", error);
      }
    }
  };

  return (
    <div>
      <div
        className="mb-3"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Label className="text-3xl font-bold">Application Details</Label>
        <Button className="blueButton" onClick={markAsRead}>
          {application.status === "R" ? "Mark Application as Unread" : "Mark Application as Read"}
        </Button>
      </div>

      <div className="mb-3">
        <Label className="text-xl font-semibold" data-testid="full-name-label">
          Full name: {jobSeeker.first_name} {jobSeeker.last_name}
        </Label>
        <Label className="text-lg">
          <p>Other names: {jobSeeker.other_names}</p>
          <p>Email: {jobSeeker.email}</p>
          <p>Phone: {jobSeeker.phone_number}</p>
          <p>Date of Birth: {jobSeeker.dob}</p>
          <p>Nationality: {jobSeeker.nationality}</p>
          <p>Sex: {jobSeeker.sex === "M" ? "Male" : "Female"}</p>
          <p className="text-lg font-semibold">Address:</p>
          <p>City: {jobSeeker.address?.city}</p>
          <p>Post Code: {jobSeeker.address?.post_code}</p>
          <p>Country: {jobSeeker.address?.country}</p>
        </Label>
      </div>

      <div className="mb-3">
        <DisplayResume resumeId={resume.id} />
      </div>

      {questions.length > 0 && (
        <div className="mb-3">
          <Label className="text-xl font-semibold">Questions and Answers:</Label>
          <QuestionsAndAnswers questions={questions} answers={answers} />
        </div>
      )}

      <div className="mb-3">
        <Label className="text-xl font-semibold">Decision:</Label>
        <br />
        <Select
          id="decision"
          className="w-60 mt-2"
          value={application.decision}
          onChange={(value) => handleDecisionChange(value)}
        >
          <Select.Option value="U">Undecided</Select.Option>
          <Select.Option value="R">Rejected</Select.Option>
          <Select.Option value="A">Accepted</Select.Option>
        </Select>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;
