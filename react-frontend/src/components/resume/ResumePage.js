import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../Axios';
import {jwtDecode} from 'jwt-decode';
import swal from 'sweetalert2';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { Axios } from 'axios';
import ResumeForm from './ResumeForm';
import SoftSkills from './SoftSkill';
import TechnicalSkills from './TechnicalSkill';
import Languages from './Language';
import Education from './Education';
import ProfessionalExperience from './ProfessionalExperience';


function UpdateResumePage() {

  const showError = (message) => {
    swal.fire({
      title: message,
      icon: "error",
      toast: true,
      timer: 6000,
      position: 'top-right',
      timerProgressBar: true,
      showConfirmButton: false,
  });
  }

  const showSuccess = (message) => {
    swal.fire({
      title: message,
      icon: "success",
      toast: true,
      timer: 6000,
      position: 'top-right',
      timerProgressBar: true,
      showConfirmButton: false,
  });
  }

  const [resumeId, setResumeId] = useState(null);


  const {user} = useContext(AuthContext);
  const userId = user.user_id;
  console.log(userId);

  useEffect(() => {
    async function fetchResumeId() {
      const response = await AxiosInstance.get(`http://localhost:8000/api/job-seekers/${userId}/`);
      const data = await response.data;
      if (response.status === 404){
        console.log("Jobseeker not found");
      }
      if (data.resume === null) {
        console.log("Resume not found");
        // TODO : Create a new resume
      }
      return data.resume;
    }

    fetchResumeId().then(id => {
      setResumeId(id);
    });
  }, [userId]);

  return (
      <div>
          <h1>Resume</h1>
          <ResumeForm resumeId={resumeId} showError={showError} showSuccess={showSuccess}/>
          <SoftSkills resumeId={resumeId} showError={showError} showSuccess={showSuccess}/>
          <TechnicalSkills resumeId={resumeId} showError={showError} showSuccess={showSuccess}/>
          <Languages resumeId={resumeId} showError={showError} showSuccess={showSuccess}/>
          <Education resumeId={resumeId} showError={showError} showSuccess={showSuccess}/>
          <ProfessionalExperience resumeId={resumeId} showError={showError} showSuccess={showSuccess}/>
      </div>
  );
}

export default UpdateResumePage;