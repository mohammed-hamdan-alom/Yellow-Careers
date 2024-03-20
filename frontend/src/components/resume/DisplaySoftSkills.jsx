import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { Tag } from "antd";
import '../styling/tag.css';
import '../styling/shadow.css'; 

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
    <div className="bg-white shadow-pink rounded-md p-6 mt-6">
      <h3 className="text-lg font-semibold mb-2">
        <Tag className="tag-large" color="pink">Soft Skills</Tag>
      </h3>
      <ul className="list-disc list-inside">
        {softSkills.map((skillObj, index) => (
          <li key={index} className="text-gray-600">
            {skillObj.skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DisplaySoftSkills;
