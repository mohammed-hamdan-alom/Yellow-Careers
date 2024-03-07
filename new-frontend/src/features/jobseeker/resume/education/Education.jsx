import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "@/components/Alert/Alert";
import Popup from "../Popup/Popup";
import EditEducationPage from "./EditEducationPage";

function Education({ resumeId }) {
  const [educations, setEducations] = useState([]);
  const [createPopup, setCreatePopup] = useState(false);
  const [editPopup, setEditPopup] = useState(null);
  const [openPopupId, setOpenPopupId] = useState(null);

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

  //Delete education
  const handleDeleteEducation = (educationObj) => {
    AxiosInstance.delete(
      `http://localhost:8000/api/resumes/${resumeId}/educations/update/${educationObj.id}`
    )
      .then((response) => {
        showSuccess("Education Deleted");
        setEducations((prevEducations) =>
          prevEducations.filter((item) => item !== educationObj)
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        showError("Deleting Education Failed");
      });
  };

  return (
    <div>
      <h2>Education</h2>
      <ul>
        {educations.map((education, index) => (
          <li key={index}>
            <p>start date: {education.start_date}</p>
            <p>end:date : {education.end_date}</p>
            <p>level: {education.level}</p>
            <p>institution : {education.institution}</p>
            <p>grade: {education.grade}</p>
            {education.address && (
              <>
                <p>City: {education.address.city}</p>
                <p>Post Code: {education.address.post_code}</p>
                <p>Country: {education.address.country}</p>
              </>
            )}
            <button
              onClick={() => {
                setEditPopup(true);
                setOpenPopupId(education.id);
              }}
            >
              Edit Education
            </button>
            <Popup
              trigger={editPopup && openPopupId === education.id}
              setTrigger={() => {
                setOpenPopupId(null);
              }}
            >
              <EditEducationPage
                put={true}
                resumeId={resumeId}
                setEducations={setEducations}
                setButtonPopup={setEditPopup}
                educationId={education.id}
              />
            </Popup>

            <button onClick={() => handleDeleteEducation(education)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div>
        <button
          onClick={() => {
            setCreatePopup(true);
          }}
        >
          Add Education
        </button>
        <Popup trigger={createPopup} setTrigger={setCreatePopup}>
          <EditEducationPage
            post={true}
            resumeId={resumeId}
            setEducations={setEducations}
            setButtonPopup={setCreatePopup}
          />
        </Popup>
      </div>
    </div>
  );
}

export default Education;
