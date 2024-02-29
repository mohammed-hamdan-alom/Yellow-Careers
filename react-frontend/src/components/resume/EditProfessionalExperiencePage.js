import React, { useState, useEffect } from "react";
import AxiosInstance from "../../Axios";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "./notificationUtils";

function EditProfessionalExperience({
  put,
  post,
  resumeId,
  setProfessionalExperiences,
  setButtonPopup,
  professionalExperienceId,
}) {
  const defaultExperienceState = {
    start_date: "",
    end_date: "",
    company: "",
    position: "",
    description: "",
    address: {
      city: "",
      post_code: "",
      country: "",
    },
  };

  const [professionalExperience, setProfessionalExperience] = useState(
    defaultExperienceState
  );
  const [errors, setErrors] = useState(defaultExperienceState);

  useEffect(() => {
    if (put) {
      AxiosInstance.get(
        `api/resumes/${resumeId}/professional-experiences/update/${professionalExperienceId}`
      )
        .then((response) => {
          setProfessionalExperience(response.data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, []);

  const handleProfessionalExperienceChange = (event) => {
    const { name, value } = event.target;
    if (name.includes("address")) {
      const addressField = name.split(".")[1]; // Extract the address field name
      setProfessionalExperience({
        ...professionalExperience,
        address: {
          ...professionalExperience.address,
          [addressField]: value,
        },
      });
    } else {
      setProfessionalExperience({ ...professionalExperience, [name]: value });
    }
  };

  const handleSubmit = (event) => {
    if (post) {
      handleCreateProfessionalExperience(event);
    } else if (put) {
      handleEditSubmit(event);
    } else {
      console.error(
        "Pass in POST or PUT as a prop to the EditProfessionalExperience component."
      );
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    AxiosInstance.put(
      `api/resumes/${resumeId}/professional-experiences/update/${professionalExperienceId}`,
      professionalExperience
    )
      .then((res) => {
        showSuccess("Professional Experience Updated");
        setErrors(defaultExperienceState);
        setProfessionalExperience(defaultExperienceState);
        AxiosInstance.get(`api/resumes/${resumeId}/professional-experiences/`)
          .then((response) => {
            setProfessionalExperiences(response.data);
          })
          .catch((error) => console.error("Error:", error));
        setButtonPopup(false);
      })
      .catch((error) => {
        console.error(error);
        let errorMessages = "";
        if (error.response && error.response.data) {
          errorMessages = Object.values(error.response.data).join(" ");
          setErrors(error.response.data);
        }
        showError("Updating Professional Experience Failed");
      });
  };

  const handleCreateProfessionalExperience = (event) => {
    event.preventDefault();
    AxiosInstance.post(
      `api/resumes/${resumeId}/professional-experiences/create/`,
      professionalExperience
    )
      .then((response) => {
        showSuccess("Professional Experience Added");
        setProfessionalExperience(defaultExperienceState);
        setErrors(defaultExperienceState);
        setButtonPopup(false);
        AxiosInstance.get(
          `api/resumes/${resumeId}/professional-experiences/`
        ).then((response) => {
          setProfessionalExperiences(response.data);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        let errorMessages = "";
        if (error.response && error.response.data) {
          errorMessages = Object.values(error.response.data).join(" ");
          setErrors(error.response.data);
        }
        showError("Creating Professional Experience Failed");
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={professionalExperience.start_date}
            onChange={handleProfessionalExperienceChange}
          />
          {errors.start_date && <p>{errors.start_date}</p>}
        </div>
        <div>
          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={professionalExperience.end_date}
            onChange={handleProfessionalExperienceChange}
          />
          {errors.end_date && <p>{errors.end_date}</p>}
        </div>
        <div>
          <label>company</label>
          <input
            type="text"
            name="company"
            value={professionalExperience.company}
            onChange={handleProfessionalExperienceChange}
          />
          {errors.company && <p>{errors.company}</p>}
        </div>
        <div>
          <label>position</label>
          <input
            type="text"
            name="position"
            value={professionalExperience.position}
            onChange={handleProfessionalExperienceChange}
          />
          {errors.position && <p>{errors.position}</p>}
        </div>
        <div>
          <label>description</label>
          <input
            type="text"
            name="description"
            value={professionalExperience.description}
            onChange={handleProfessionalExperienceChange}
          />
          {errors.description && <p>{errors.description}</p>}
        </div>
        {professionalExperience.address && (
          <>
            <div>
              <label>city</label>
              <input
                type="text"
                name="address.city"
                value={professionalExperience.address.city}
                onChange={handleProfessionalExperienceChange}
              />
              {errors.address && errors.address.city && (
                <p>{errors.address.city}</p>
              )}
            </div>
            <div>
              <label>post code</label>
              <input
                type="text"
                name="address.post_code"
                value={professionalExperience.address.post_code}
                onChange={handleProfessionalExperienceChange}
              />
              {errors.address && errors.address.post_code && (
                <p>{errors.address.post_code}</p>
              )}
            </div>
            <div>
              <label>country</label>
              <input
                type="text"
                name="address.country"
                value={professionalExperience.address.country}
                onChange={handleProfessionalExperienceChange}
              />
              {errors.address && errors.address.country && (
                <p>{errors.address.country}</p>
              )}
            </div>
          </>
        )}
        <br />
        <button>Submit</button>
      </form>
    </div>
  );
}
export default EditProfessionalExperience;
