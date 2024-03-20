import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";

function DisplaySoftSkills({ resumeId }) {
  const [softSkills, setSoftSkills] = useState([]);

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
