import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";

function DisplayEducation({ resumeId }) {
  const [educations, setEducations] = useState([]);

  useEffect(() => {
    const fetchEducations = async () => {
      if (!resumeId) {
        return;
      }
      try {
        const response = await AxiosInstance.get(`api/resumes/${resumeId}/educations/`);
        setEducations(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };  
    fetchEducations();
  }, [resumeId]);


  return (
    <div>
      <h2>Education</h2>
      <ul>
        {educations.map((education, index) => (
          <li key={index}>
            {console.log(education)}
            <p>course name: {education.course_name}</p>
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
