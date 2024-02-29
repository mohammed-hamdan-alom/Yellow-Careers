import React, { useState, useEffect } from "react";
import AxiosInstance from "../../../Axios";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "./notificationUtils";
import Popup from "./Popup";
import EditProfessionalExperience from "./EditProfessionalExperiencePage";

function ProfessionalExperience({ resumeId }) {
  const [professionalExperiences, setProfessionalExperiences] = useState([]);
  const [createPopup, setCreatePopup] = useState(false);
  const [editPopup, setEditPopup] = useState(null);
  const [openPopupId, setOpenPopupId] = useState(null);

  useEffect(() => {
    if (!resumeId) {
      return;
    }
    AxiosInstance.get(`api/resumes/${resumeId}/professional-experiences/`)
      .then((response) => {
        setProfessionalExperiences(response.data);
      })
      .catch((error) => console.error("Error:", error));
  }, [resumeId]);

  //Delete a professional experience
  const handleDeleteProfessionalExperience = (professionalExperienceObj) => {
    AxiosInstance.delete(
      `api/resumes/${resumeId}/professional-experiences/update/${professionalExperienceObj.id}`
    )
      .then((response) => {
        showSuccess("Professional Experience Deleted");
        setProfessionalExperiences((prevprofessionalExperiences) =>
          prevprofessionalExperiences.filter(
            (item) => item !== professionalExperienceObj
          )
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        showError("Deleting Professional Experience Failed");
      });
  };

  return (
    <div>
      <h2>Professional Experience</h2>
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
            <button
              onClick={() => {
                setEditPopup(true);
                setOpenPopupId(professionalExperience.id);
              }}
            >
              Edit Professional Experience
            </button>
            <Popup
              trigger={editPopup && openPopupId === professionalExperience.id}
              setTrigger={() => {
                setOpenPopupId(null);
              }}
            >
              <EditProfessionalExperience
                put={true}
                resumeId={resumeId}
                setProfessionalExperiences={setProfessionalExperiences}
                setButtonPopup={setEditPopup}
                professionalExperienceId={professionalExperience.id}
              />
            </Popup>
            <button
              onClick={() =>
                handleDeleteProfessionalExperience(professionalExperience)
              }
            >
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
          Add Professional Experience
        </button>
        <Popup trigger={createPopup} setTrigger={setCreatePopup}>
          <EditProfessionalExperience
            post={true}
            resumeId={resumeId}
            setProfessionalExperiences={setProfessionalExperiences}
            setButtonPopup={setCreatePopup}
          />
        </Popup>
      </div>
    </div>
  );
}
export default ProfessionalExperience;
