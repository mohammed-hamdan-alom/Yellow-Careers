import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import DisplaySoftSkills from "@/components/resume/DisplaySoftSkills";
import DisplayTechnicalSkills from "@/components/resume/DisplayTechnicalSkills";
import DisplayEducation from "@/components/resume/DisplayEducation";
import DisplayLanguages from "@/components/resume/DisplayLanguages";
import DisplayProfessionalExperience from "@/components/resume/DisplayProfessionalExperience";

function DisplayResume({ resumeId }) {
  const defaultResumeState = {
    github: "",
    linkedin: "",
    about: "",
    experience: "",
  };

  const [resume, setResume] = useState(defaultResumeState);

  useEffect(() => {
    if (!resumeId) {
      return;
    }
    AxiosInstance.get(`api/resumes/${resumeId}/`)
      .then((response) => {
        setResume(response.data);
      })
      .catch((error) => console.error("Error:", error));
  }, [resumeId]);

  return (
    <div>
      <div>
        <h3>Resume Info</h3>
        <div>Github: {resume.github}</div>
        <div>LinkedIN: {resume.linkedin}</div>
        <div>About: {resume.about}</div>
        <div>Experience: {resume.experience}</div>
      </div>
      <DisplaySoftSkills resumeId={resumeId} />
      <DisplayTechnicalSkills resumeId={resumeId} />
      <DisplayLanguages resumeId={resumeId} />
      <DisplayEducation resumeId={resumeId} />
      <DisplayProfessionalExperience resumeId={resumeId} />
    </div>
  );
}

export default DisplayResume;
