import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";

function DisplayTechnicalSkills({ resumeId }) {
  const [technicalSkills, setTechnicalSkills] = useState([]);

  useEffect(() => {
    if (!resumeId) {
      return;
    }
    AxiosInstance.get(`api/resumes/${resumeId}/technical-skills/`)
      .then((response) => {
        setTechnicalSkills(response.data);
      })
      .catch((error) => console.error("Error:", error));
  }, [resumeId]);

  return (
    <div>
      <h3>Technical Skills:</h3>
      <ul>
        {technicalSkills.map((skillObj, index) => (
          <li key={index}>{skillObj.skill}</li>
        ))}
      </ul>
    </div>
  );
}

export default DisplayTechnicalSkills;