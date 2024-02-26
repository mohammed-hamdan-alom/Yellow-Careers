import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AxiosInstance from "../../Axios";
import { showError, showSuccess } from "./notificationUtils";

function UpdateProfessionalExperiencePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const defaultExperienceState = useLocation().state.defaultExperienceState;
  const resumeId = useLocation().state.resumeId;
  const [errors, setErrors] = useState(defaultExperienceState);
  const [experience, setExperience] = useState(defaultExperienceState);

  useEffect(() => {
    AxiosInstance.get(
      `api/resumes/${resumeId}/professional-experiences/update/${id}`
    )
      .then((res) => {
        setExperience(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name.includes("address")) {
      const addressField = name.split(".")[1]; // Extract the address field name
      setExperience({
        ...experience,
        address: {
          ...experience.address,
          [addressField]: value,
        },
      });
    } else {
      setExperience({ ...experience, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    AxiosInstance.put(
      `api/resumes/${resumeId}/professional-experiences/update/${id}`,
      experience
    )
      .then((res) => {
        showSuccess("Professional Experience Updated");
        navigate(-1);
        setErrors(defaultExperienceState);
        setExperience(defaultExperienceState);
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={experience.start_date}
            onChange={handleChange}
          />
          {errors.start_date && <p>{errors.start_date}</p>}
        </div>
        <div>
          <label>End Date</label>
          <input
            type="date"
            name="end_date"
            value={experience.end_date}
            onChange={handleChange}
          />
          {errors.end_date && <p>{errors.end_date}</p>}
        </div>
        <div>
          <label>company</label>
          <input
            type="text"
            name="company"
            value={experience.company}
            onChange={handleChange}
          />
          {errors.company && <p>{errors.company}</p>}
        </div>
        <div>
          <label>position</label>
          <input
            type="text"
            name="position"
            value={experience.position}
            onChange={handleChange}
          />
          {errors.position && <p>{errors.position}</p>}
        </div>
        <div>
          <label>description</label>
          <input
            type="text"
            name="description"
            value={experience.description}
            onChange={handleChange}
          />
          {errors.description && <p>{errors.description}</p>}
        </div>
        {experience.address && (
          <>
            <div>
              <label>city</label>
              <input
                type="text"
                name="address.city"
                value={experience.address.city}
                onChange={handleChange}
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
                value={experience.address.post_code}
                onChange={handleChange}
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
                value={experience.address.country}
                onChange={handleChange}
              />
              {errors.address && errors.address.country && (
                <p>{errors.address.country}</p>
              )}
            </div>
          </>
        )}
        <br />
        <button> Update</button>
      </form>
    </div>
  );
}

export default UpdateProfessionalExperiencePage;
