import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { Tag } from "antd";
import "../styling/tag.css";
import "../styling/shadow.css";

/**
 * Component to display the soft skills of a resume.
 */
function DisplaySoftSkills({ resumeId }) {
  const [softSkills, setSoftSkills] = useState([]);

  /**
   * Fetches the soft skills data from the API.
   */
  useEffect(() => {
    const fetchSoftSkills = async () => {
      if (!resumeId) {
        return;
      }
      try {
        const response = await AxiosInstance.get(`api/resumes/${resumeId}/soft-skills/`);
        setSoftSkills(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchSoftSkills();
  }, [resumeId]);

  return (
    <div className="bg-white shadow-pink rounded-md p-6 mt-6">
      <h3 className="text-lg font-semibold mb-2">
        <Tag className="tag-large" color="pink">
          Soft Skills
        </Tag>
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
