import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";

function DisplayEducation({ resumeId }) {
  const [educations, setEducations] = useState([]);

  useEffect(() => {
    if (!resumeId) {
      return;
    }
    AxiosInstance.get(`api/resumes/${resumeId}/educations/`)
      .then((response) => {
        setEducations(response.data);
      })
      .catch((error) => console.error("Error:", error));
  }, [resumeId]);

  return (
    <div>
      <h2>Education</h2>
      <ul>
        {educations.map((education, index) => (
          <li key={index}>
            <p>start date: {education.start_date}</p>
            <p>end date: {education.end_date}</p>
            <p>level: {education.level}</p>
            <p>institution: {education.institution}</p>
            <p>grade: {education.grade}</p>
            {education.address && (
              <>
                <p>City: {education.address.city}</p>
                <p>Post Code: {education.address.post_code}</p>
                <p>Country: {education.address.country}</p>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DisplayEducation;
