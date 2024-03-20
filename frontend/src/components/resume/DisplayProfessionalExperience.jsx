import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";


function DisplayProfessionalExperience({ resumeId }) {
  const [professionalExperiences, setProfessionalExperiences] = useState([]);
  
  useEffect(() => {
    const fetchProfessionalExperiences = async () => {
      if (!resumeId) {
        return;
      }
      try {
        const response = await AxiosInstance.get(`api/resumes/${resumeId}/professional-experiences/`);
        setProfessionalExperiences(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProfessionalExperiences();
  }, [resumeId]);


  return (
    <div>
      <h3>Professional Experience</h3>
      <ul>
        {professionalExperiences.map((professionalExperience, index) => (
          <li key={index}>
            <p>start date: {professionalExperience.start_date}</p>
            <p>end date : {professionalExperience.end_date}</p>
            <p>company: {professionalExperience.company}</p>
            <p>position : {professionalExperience.position}</p>
            {professionalExperience.address && (
              <>
                <p>City: {professionalExperience.address.city}</p>
                <p>Post Code: {professionalExperience.address.post_code}</p>
                <p>Country: {professionalExperience.address.country}</p>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DisplayProfessionalExperience;
