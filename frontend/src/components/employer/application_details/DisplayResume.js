import React, { useState, useEffect } from "react";
import AxiosInstance from "../../../Axios";

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
    </div>
  );
}

export default DisplayResume;
