import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";

function DisplaySoftSkills({ resumeId }) {
  const [softSkills, setSoftSkills] = useState([]);

  useEffect(() => {
    if (!resumeId) {
      return;
    }
    AxiosInstance.get(`api/resumes/${resumeId}/soft-skills/`)
      .then((response) => {
        setSoftSkills(response.data);
      })
      .catch((error) => console.error("Error:", error));
  }, [resumeId]);

  return (
    <div>
      <h3>Soft Skills</h3>
      <ul>
        {softSkills.map((skillObj, index) => (
          <li key={index}>{skillObj.skill}</li>
        ))}
      </ul>
    </div>
  );
}

export default DisplaySoftSkills;
