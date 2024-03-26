import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { Tag } from "antd";
import "../styling/tag.css";
import "../styling/shadow.css";

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
    <div className="bg-white shadow-cyan rounded-md p-6 mt-6">
      <h3 className="text-lg font-semibold mb-2">
        <Tag className="tag-large" color="cyan">
          Technical Skills
        </Tag>{" "}
        {/* Change color to cyan */}
      </h3>
      <ul className="list-disc list-inside">
        {technicalSkills.map((skillObj, index) => (
          <li key={index} className="text-gray-600">
            {skillObj.skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DisplayTechnicalSkills;
