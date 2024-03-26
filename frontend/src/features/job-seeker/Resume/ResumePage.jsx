import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import ResumeForm from "./ResumeForm";
import SoftSkill from "./Skills/SoftSkill";
import TechnicalSkill from "./Skills/TechnicalSkill";
import Language from "./Language/Language";
import Education from "./Education/Education";
import ProfessionalExperience from "./ProfessionalExperience/ProfessionalExperience";

function UpdateResumePage() {
  const [resumeId, setResumeId] = useState(null);
  const { user } = useContext(AuthContext);
  const userId = user.user_id;

  useEffect(() => {
    async function fetchResumeId() {
      const response = await AxiosInstance.get(`api/job-seekers/${userId}/`);
      const data = await response.data;
      if (response.status === 404) {
        console.log("Jobseeker not found");
      }
      if (data.resume === null) {
        console.log("Resume not found");
        const response = await AxiosInstance.post(`api/resumes/create/`, {
          github: "",
          linkedin: "",
          about: "",
          experience: "",
        });
        AxiosInstance.patch(`api/job-seekers/${userId}/update/`, {
          resume: response.data.id,
        });
      }
      return data.resume;
    }

    fetchResumeId().then((id) => {
      setResumeId(id);
    });
  }, [userId]);

  return (
    <div className="pb-96">
      <div className="flex flex-row justify-left mt-4 ">
        <Education resumeId={resumeId} />
        <ProfessionalExperience resumeId={resumeId} />
      </div>
      <div className="flex flex-row justify-left sm:flex-wrap">
        <ResumeForm resumeId={resumeId} />
        <SoftSkill resumeId={resumeId} />
      </div>
      <div className="flex flex-row justify-left mt-4 sm:flex-col">
        <Language resumeId={resumeId} />
        <TechnicalSkill resumeId={resumeId} />
      </div>
    </div>
  );
}

export default UpdateResumePage;