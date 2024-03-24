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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { checkUserIdAndReload } from "@/components/refreshUser/refreshUser"


function UpdateResumePage() {
  const [resumeId, setResumeId] = useState(null);
  const { user } = useContext(AuthContext);
  const [buttonPopup, setButtonPopup] = useState(false);
  const userId = user.user_id;

  useEffect(() => {
    async function fetchResumeId() {
      const response = await AxiosInstance.get(`api/job-seekers/${userId}/`);
      const data = await response.data;
      if (response.status === 404) {
        console.log("Jobseeker not found");
        checkUserIdAndReload(userId)

      }
      if (data.resume === null) {
        //Havent tested if it works
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

    <div className='pb-96'>
      <div className="flex flex-row justify-left">
        <ResumeForm resumeId={resumeId} />
        <SoftSkill resumeId={resumeId} />
      </div>
      <div className="flex flex-row justify-left mt-12">
        <Language resumeId={resumeId} />
        <TechnicalSkill resumeId={resumeId} />
      </div>
      <div className="flex flex-row justify-left mt-12 w-full">
        <Education resumeId={resumeId} />
        <ProfessionalExperience resumeId={resumeId} />
      </div>
    </div>
  );
}

export default UpdateResumePage;
