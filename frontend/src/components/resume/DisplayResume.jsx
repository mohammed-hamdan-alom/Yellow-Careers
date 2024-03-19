import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import DisplaySoftSkills from "@/components/resume/DisplaySoftSkills";
import DisplayTechnicalSkills from "@/components/resume/DisplayTechnicalSkills";
import DisplayEducation from "@/components/resume/DisplayEducation";
import DisplayLanguages from "@/components/resume/DisplayLanguages";
import DisplayProfessionalExperience from "@/components/resume/DisplayProfessionalExperience";
import { Label } from "@/components/ui/label";

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
    <div className="bg-white shadow-md rounded-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Resume Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <Label>Github:</Label>
            <span className="text-gray-600">{resume.github}</span>
          </div>
          <div className="flex flex-col">
            <Label>LinkedIn:</Label>
            <span className="text-gray-600">{resume.linkedin}</span>
          </div>
          <div className="flex flex-col">
            <Label>About:</Label>
            <span className="text-gray-600">{resume.about}</span>
          </div>
          <div className="flex flex-col">
            <Label>Experience:</Label>
            <span className="text-gray-600">{resume.experience}</span>
          </div>
        </div>
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
