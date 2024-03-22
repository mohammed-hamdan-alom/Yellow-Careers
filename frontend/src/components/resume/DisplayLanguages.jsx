import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { Tag } from "antd";
import '../styling/tag.css';
import '../styling/shadow.css';

function DisplayLanguages({ resumeId }) {
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      if (!resumeId) {
        return;
      }
      try {
        const response = await AxiosInstance.get(`api/resumes/${resumeId}/languages/`);
        setLanguages(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchLanguages();
  }, [resumeId]);
  return (
    <div className="bg-white shadow-orange rounded-md p-6 mt-6">
      <h3 className="text-lg font-semibold mb-2">
        <Tag className="tag-large" color="orange">Languages</Tag>
      </h3>
      <ul>
        {languages.map((language, index) => (
          <li key={index} className="text-gray-600 mb-4">
            <p><strong>Language:</strong> {language.language}</p>
            <p><strong>Spoken proficiency:</strong> {language.spoken_proficiency}</p>
            <p><strong>Written proficiency:</strong> {language.written_proficiency}</p>
            {/* Add divider if it's not the last language item */}
            {index < languages.length - 1 && <hr className="my-4 border-gray-300" />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DisplayLanguages;
