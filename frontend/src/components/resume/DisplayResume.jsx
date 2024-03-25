import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import DisplaySoftSkills from "@/components/resume/DisplaySoftSkills";
import DisplayTechnicalSkills from "@/components/resume/DisplayTechnicalSkills";
import DisplayEducation from "@/components/resume/DisplayEducation";
import DisplayLanguages from "@/components/resume/DisplayLanguages";
import DisplayProfessionalExperience from "@/components/resume/DisplayProfessionalExperience";
import { Label } from "@/components/ui/label";
import "../styling/shadow.css";

function DisplayResume({ resumeId }) {
  const defaultResumeState = {
    website: "",
    linkedin: "",
    about: "",
    experience: "",
  };

  const [resume, setResume] = useState(defaultResumeState);

  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) {
        return;
      }
      try {
        const response = await AxiosInstance.get(`api/resumes/${resumeId}/`);
        setResume(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchResume();
  }, [resumeId]);

  return (
    <div className="bg-white shadow-orange rounded-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Resume</h2>
        <div className="flex flex-col mb-4">
          <Label>About:</Label>
          <span className="text-gray-500">{resume.about}</span>
        </div>
        <div className="flex flex-col mb-4">
          <Label>Experience:</Label>
          <span className="text-gray-500">{resume.experience}</span>
        </div>
        <div className="flex space-x-20">
          <div className="flex flex-col">
            <Label>Website:</Label>
            <span>
              <a
                href={resume.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:underline"
              >
                {resume.website}
              </a>
            </span>
          </div>
          <div className="flex flex-col">
            <Label>LinkedIn:</Label>
            <span>
              <a
                href={resume.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:underline"
              >
                {resume.linkedin}
              </a>
            </span>
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
