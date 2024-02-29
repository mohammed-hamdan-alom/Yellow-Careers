import React, { useState, useEffect } from "react";
import AxiosInstance from "../../Axios";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import ResumeForm from "./ResumeForm";
import SoftSkills from "./SoftSkill";
import TechnicalSkills from "./TechnicalSkill";
import Languages from "./Language";
import Education from "./Education";
import ProfessionalExperience from "./ProfessionalExperience";
import Popup from "./Popup";
import { Axios } from "axios";

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
      }
      if (data.resume === null) {

        //Havent tested if it works
        console.log("Resume not found");
        const response = await AxiosInstance.post(`api/resumes/create`, {
          'github': '',
          'linkedin': '',
          'about': '',
          'experience':''
        });
        AxiosInstance.patch(`api/job-seekers/${userId}/update`, {
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
    <div>
      <h1>Resume</h1>
      <ResumeForm resumeId={resumeId} />
      <SoftSkills resumeId={resumeId} />
      <TechnicalSkills resumeId={resumeId} />
      <Languages resumeId={resumeId} />
      <Education resumeId={resumeId} />
      <ProfessionalExperience resumeId={resumeId} />
    </div>
  );
}

export default UpdateResumePage;
