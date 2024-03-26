import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from "@/components/Alert/alert";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "antd";
const { TextArea } = Input;
import { DatePicker } from "antd";
import BigAlert from "@/components/Alert/BigAlert";
import dayjs from "dayjs";

function EditProfessionalExperience({
  put,
  post,
  resumeId,
  setProfessionalExperiences,
  professionalExperienceId,
  closeAddModal,
  closeEditModal,
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

  const [professionalExperience, setProfessionalExperience] = useState(defaultExperienceState);
  const [errors, setErrors] = useState(defaultExperienceState);

  useEffect(() => {
    const fetchProfessionalExperience = async () => {
      if (put) {
        try {
          const response = await AxiosInstance.get(
            `api/resumes/${resumeId}/professional-experiences/update/${professionalExperienceId}`,
          );
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

  const handleStartDateChange = (date) => {
    if (date) {
      setProfessionalExperience({
        ...professionalExperience,
        start_date: dayjs(date).format("YYYY-MM-DD"),
      });
    }
  };

  const handleEndDateChange = (date) => {
    if (date) {
      setProfessionalExperience({
        ...professionalExperience,
        end_date: dayjs(date).format("YYYY-MM-DD"),
      });
    }
  };

  const handleSubmit = (event) => {
    if (post) {
      handleCreateProfessionalExperience(event);
    } else if (put) {
      handleEditSubmit(event);
    } else {
      console.error("Pass in POST or PUT as a prop to the EditProfessionalExperience component.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await AxiosInstance.put(
        `api/resumes/${resumeId}/professional-experiences/update/${professionalExperienceId}`,
        professionalExperience,
      );
      showSuccess("Professional Experience Updated");
      setErrors(defaultExperienceState);
      setProfessionalExperience(defaultExperienceState);

      const response = await AxiosInstance.get(`api/resumes/${resumeId}/professional-experiences/`);
      setProfessionalExperiences(response.data);
      closeEditModal();
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
      await AxiosInstance.post(
        `api/resumes/${resumeId}/professional-experiences/create/`,
        professionalExperience,
      );
      showSuccess("Professional Experience Added");
      setProfessionalExperience(defaultExperienceState);
      setErrors(defaultExperienceState);

      const response = await AxiosInstance.get(`api/resumes/${resumeId}/professional-experiences/`);
      setProfessionalExperiences(response.data);
      closeAddModal();
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
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label>Company</Label>
          <Input
            name="company"
            value={professionalExperience.company}
            onChange={handleProfessionalExperienceChange}
          />
          {errors.company && <BigAlert message={errors.company} />}
        </div>
        <div className="mb-4">
          <Label>Position</Label>
          <Input
            name="position"
            value={professionalExperience.position}
            onChange={handleProfessionalExperienceChange}
          />
          {errors.position && <BigAlert message={errors.position} />}
        </div>
        <div className="mb-4 flex flex-row items-center justify-between">
          <Label className="mr-4">Start Date</Label>
          <DatePicker
            className="w-4/5"
            name="start_date"
            value={
              professionalExperience.start_date ? dayjs(professionalExperience.start_date) : null
            }
            onChange={handleStartDateChange}
          />
          {errors.start_date && <BigAlert message={errors.start_date} />}
        </div>
        <div className="mb-4 flex flex-row items-center justify-between">
          <Label className="mr-4">End Date</Label>
          <DatePicker
            className="w-4/5"
            name="end_date"
            value={professionalExperience.end_date ? dayjs(professionalExperience.end_date) : null}
            onChange={handleEndDateChange}
          />
          {errors.end_date && <BigAlert message={errors.end_date} />}
        </div>
        <div className="mb-4">
          <Label>Description</Label>
          <TextArea
            name="description"
            value={professionalExperience.description}
            onChange={handleProfessionalExperienceChange}
          />
          {errors.description && <BigAlert message={errors.description} />}
        </div>

        {professionalExperience.address && (
          <div className="flex flex-row w-full mt-8 justify-between items-center space-x-2">
            <div className="flex flex-col justify-between items-center mb-4 ">
              <Label className="w-full text-1xl">City</Label>
              <Input
                className="w-full"
                type="text"
                name="address.city"
                value={professionalExperience.address.city}
                onChange={handleProfessionalExperienceChange}
              />
            </div>
            <div className="mb-4">
              {errors.address && errors.address.city && (
                <BigAlert
                  className="ml-4"
                  message={"Enter valid city"}
                  description={""}
                  type="error"
                />
              )}
            </div>
            <div className="flex flex-col justify-between items-center mb-4">
              <Label className="w-full text-1xl">Post Code</Label>
              <Input
                className="w-full"
                type="text"
                name="address.post_code"
                value={professionalExperience.address.post_code}
                onChange={handleProfessionalExperienceChange}
              />
            </div>
            <div className="mb-4">
              {errors.address && errors.address.post_code && (
                <BigAlert
                  className="ml-4"
                  message={"Enter valid post code"}
                  description={""}
                  type="error"
                />
              )}
            </div>
            <div className="flex flex-col justify-between items-center mb-4">
              <Label className="w-full text-1xl">Country</Label>
              <Input
                className="w-full"
                type="text"
                name="address.country"
                value={professionalExperience.address.country}
                onChange={handleProfessionalExperienceChange}
              />
            </div>
            <div className="mb-4">
              {errors.address && errors.address.country && (
                <BigAlert
                  className="ml-4"
                  message={"Enter valid country"}
                  description={""}
                  type="error"
                />
              )}
            </div>
          </div>
        )}
        <br />
        <Button className="w-full " variant="outline" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default EditProfessionalExperience;
