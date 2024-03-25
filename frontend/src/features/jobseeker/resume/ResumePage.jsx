import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import ResumeForm from "./ResumeForm";
import SoftSkill from "./skills/SoftSkill";
import TechnicalSkill from "./skills/TechnicalSkill";
import Language from "./language/Language";
import Education from "./education/Education";
import ProfessionalExperience from "./professional-experience/ProfessionalExperience";



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
          website: "",
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
      <div className="flex flex-col justify-between mt-4 ">
        <Education resumeId={resumeId} />
        <ProfessionalExperience resumeId={resumeId} />
        <ResumeForm resumeId={resumeId} />
        <Language resumeId={resumeId} />
        <div className="flex flex-row justify-between mt-4 space-x-6">
          <SoftSkill resumeId={resumeId} />
          <TechnicalSkill resumeId={resumeId} />
        </div>
      </div>
    </div>
  );
}

export default UpdateResumePage;
