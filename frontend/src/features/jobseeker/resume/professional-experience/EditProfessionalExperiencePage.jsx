import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from '@/components/Alert/Alert'
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "antd";
import { DatePicker } from "antd";
import { Select } from "antd";
const { RangePicker } = DatePicker;
import BigAlert from "@/components/Alert/BigAlert";

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
    const fetchProfessionalExperience = async () => {
      if (put) {
        try {
          const response = await AxiosInstance.get(`api/resumes/${resumeId}/professional-experiences/update/${professionalExperienceId}`);
          setProfessionalExperience(response.data);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
  
    fetchProfessionalExperience();
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

  const handleDateChange = (dateStrings) => {
    setProfessionalExperience({
      ...professionalExperience,
      start_date: dateStrings[0],
      end_date: dateStrings[1],
    });
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await AxiosInstance.put(`api/resumes/${resumeId}/professional-experiences/update/${professionalExperienceId}`, professionalExperience);
      showSuccess("Professional Experience Updated");
      setErrors(defaultExperienceState);
      setProfessionalExperience(defaultExperienceState);
  
      const response = await AxiosInstance.get(`api/resumes/${resumeId}/professional-experiences/`);
      setProfessionalExperiences(response.data);
  
      setButtonPopup(false);
    } catch (error) {
      console.error(error);
      let errorMessages = "";
      if (error.response && error.response.data) {
        errorMessages = Object.values(error.response.data).join(" ");
        setErrors(error.response.data);
      }
      showError("Updating Professional Experience Failed");
    }
  };
  
  const handleCreateProfessionalExperience = async (event) => {
    event.preventDefault();
    try {
      await AxiosInstance.post(`api/resumes/${resumeId}/professional-experiences/create/`, professionalExperience);
      showSuccess("Professional Experience Added");
      setProfessionalExperience(defaultExperienceState);
      setErrors(defaultExperienceState);
      setButtonPopup(false);
  
      const response = await AxiosInstance.get(`api/resumes/${resumeId}/professional-experiences/`);
      setProfessionalExperiences(response.data);
    } catch (error) {
      console.error("Error:", error);
      let errorMessages = "";
      if (error.response && error.response.data) {
        errorMessages = Object.values(error.response.data).join(" ");
        setErrors(error.response.data);
      }
      showError("Creating Professional Experience Failed");
    }
  };

  return (
    <div className="p-12">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row justify-between items-center mb-4">
          <Label className="mr-4 w-[400px ]text-2xl"> Start -End Dates</Label>
          <RangePicker
            className="w-[400px]"
            id={{ start: professionalExperience.start_date, end: professionalExperience.end_date }}
            onChange={(dateStrings) => {
              handleDateChange(dateStrings);
            }}
          />
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
