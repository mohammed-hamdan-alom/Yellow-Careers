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
    <div className="bg-white shadow-md rounded-md p-6 mt-6">
      <h3 className="text-lg font-semibold mb-2">Technical Skills:</h3>
      <ul className="list-disc list-inside">
        {technicalSkills.map((skillObj, index) => (
          <li key={index} className="text-gray-600">{skillObj.skill}</li>
        ))}
      </ul>
    </div>
  );
}

export default DisplayTechnicalSkills;
