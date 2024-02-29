import React, { useState, useEffect } from "react";
import AxiosInstance from "../../../Axios";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "./notificationUtils";

function EditEducationPage({
  put,
  post,
  resumeId,
  setEducations,
  setButtonPopup,
  educationId,
}) {
  const defaultEducationState = {
    start_date: "",
    end_date: "",
    level: "",
    institution: "",
    grade: "",
    address: {
      city: "",
      post_code: "",
      country: "",
    },
  };

  const [education, setEducation] = useState(defaultEducationState);
  const [errors, setErrors] = useState(defaultEducationState);

  useEffect(() => {
    if (put) {
      AxiosInstance.get(
        `api/resumes/${resumeId}/educations/update/${educationId}`
      )
        .then((response) => {
          setEducation(response.data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, []);

  const handleEducationChange = (event) => {
    const { name, value } = event.target;
    if (name.includes("address")) {
      const addressField = name.split(".")[1]; // Extract the address field name
      setEducation({
        ...education,
        address: {
          ...education.address,
          [addressField]: value,
        },
      });
    } else {
      setEducation({ ...education, [name]: value });
    }
  };

  const handleSubmit = (event) => {
    if (post) {
      handleCreateEducation(event);
    } else if (put) {
      handleEditSubmit(event);
    } else {
      console.error(
        "Pass in POST or PUT as a prop to the EditEducationPage component."
      );
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    AxiosInstance.put(
      `api/resumes/${resumeId}/educations/update/${educationId}`,
      education
    )
      .then((res) => {
        showSuccess("Education Updated");
        setErrors(defaultEducationState);
        setEducation(defaultEducationState);
        AxiosInstance.get(`api/resumes/${resumeId}/educations/`)
          .then((response) => {
            setEducations(response.data);
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
        showError("Updating Education Failed");
      });
  };

  const handleCreateEducation = (event) => {
    event.preventDefault();
    AxiosInstance.post(`api/resumes/${resumeId}/educations/create/`, education)
      .then((response) => {
        showSuccess("Education Added");
        setEducation(defaultEducationState);
        setErrors(defaultEducationState);
        setButtonPopup(false);
        AxiosInstance.get(`api/resumes/${resumeId}/educations/`)
          .then((response) => {
            setEducations(response.data);
          })
          .catch((error) => console.error("Error:", error));
      })
      .catch((error) => {
        console.error("Error:", error);
        let errorMessages = "";
        if (error.response && error.response.data) {
          errorMessages = Object.values(error.response.data).join(" ");
          setErrors(error.response.data);
        }
        showError("Creating Education Failed");
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
            value={education.start_date}
            onChange={handleEducationChange}
          />
          {errors.start_date && <p>{errors.start_date}</p>}
        </div>
        <div>
          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={education.end_date}
            onChange={handleEducationChange}
          />
          {errors.end_date && <p>{errors.end_date}</p>}
        </div>
        <div>
          <label>level:</label>
          <select
            name="level"
            value={education.level}
            onChange={handleEducationChange}
          >
            <option value="">Select Level</option>
            <option value="HS">High School</option>
            <option value="BA">Bachelors</option>
            <option value="MA">Masters</option>
            <option value="PHD">Doctorate</option>
          </select>
          {errors.level && <p>{errors.level}</p>}
        </div>
        <div>
          <label>institution</label>
          <input
            type="text"
            name="institution"
            value={education.institution}
            onChange={handleEducationChange}
          />
          {errors.institution && <p>{errors.institution}</p>}
        </div>
        <div>
          <label>grade</label>
          <input
            type="text"
            name="grade"
            value={education.grade}
            onChange={handleEducationChange}
          />
          {errors.grade && <p>{errors.grade}</p>}
        </div>
        {education.address && (
          <>
            <div>
              <label>city</label>
              <input
                type="text"
                name="address.city"
                value={education.address.city}
                onChange={handleEducationChange}
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
                value={education.address.post_code}
                onChange={handleEducationChange}
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
                value={education.address.country}
                onChange={handleEducationChange}
              />
              {errors.address && errors.address.country && (
                <p>{errors.address.country}</p>
              )}
            </div>
          </>
        )}
        <br />
        <button> Submit</button>
      </form>
    </div>
  );
}
export default EditEducationPage;
