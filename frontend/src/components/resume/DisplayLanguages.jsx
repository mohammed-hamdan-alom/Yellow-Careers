import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { Tag } from "antd";
import '../styling/tag.css';
import '../styling/shadow.css';


function DisplayLanguages({ resumeId }) {
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    if (!resumeId) {
      return;
    }
    AxiosInstance.get(`api/resumes/${resumeId}/languages/`)
      .then((response) => {
        setLanguages(response.data);
      })
      .catch((error) => console.error("Error:", error));
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DisplayLanguages;
