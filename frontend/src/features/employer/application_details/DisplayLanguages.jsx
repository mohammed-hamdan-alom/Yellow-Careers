import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";

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
    <div>
      <h3>Languages</h3>
      <ul>
        {languages.map((language, index) => (
          <li key={index}>
            <p>Language: {language.language}</p>
            <p>Spoken proficiency: {language.spoken_proficiency}</p>
            <p>Written proficiency: {language.written_proficiency}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DisplayLanguages;