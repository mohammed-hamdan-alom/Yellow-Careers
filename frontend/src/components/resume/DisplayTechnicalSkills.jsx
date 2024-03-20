import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";

function DisplayTechnicalSkills({ resumeId }) {
  const [technicalSkills, setTechnicalSkills] = useState([]);

  useEffect(() => {
    const fetchTechnicalSkills = async () => {
      if (!resumeId) {
        return;
      }
      try {
        const response = await AxiosInstance.get(`api/resumes/${resumeId}/technical-skills/`);
        setTechnicalSkills(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchTechnicalSkills();
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
