import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from "@/components/Alert/alert";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "antd";
import { DatePicker } from "antd";
import { Select } from "antd";
import BigAlert from "@/components/Alert/BigAlert";
import dayjs from "dayjs";

function EditEducationPage({
  put,
  post,
  resumeId,
  setEducations,
  educationId,
  closeAddModal,
  closeEditModal,
}) {
  const defaultEducationState = {
    course_name: "",
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
    const fetchEducation = async () => {
      if (put) {
        try {
          const response = await AxiosInstance.get(
            `api/resumes/${resumeId}/educations/update/${educationId}`,
          );
          setEducation(response.data);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
    fetchEducation();
  }, []);

  const handleStartDateChange = (date) => {
    if (date) {
      setEducation({ ...education, start_date: dayjs(date).format("YYYY-MM-DD") });
    }
  };

  const handleEndDateChange = (date) => {
    if (date) {
      setEducation({ ...education, end_date: dayjs(date).format("YYYY-MM-DD") });
    }
  };

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
      console.error("Pass in POST or PUT as a prop to the EditEducationPage component.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await AxiosInstance.put(
        `api/resumes/${resumeId}/educations/update/${educationId}`,
        education,
      );
      showSuccess("Education Updated");
      setErrors(defaultEducationState);
      setEducation(defaultEducationState);

      const response = await AxiosInstance.get(`api/resumes/${resumeId}/educations/`);
      setEducations(response.data);
      closeEditModal();
    } catch (error) {
      console.error(error);
      let errorMessages = "";
      if (error.response && error.response.data) {
        errorMessages = Object.values(error.response.data).join(" ");
        setErrors(error.response.data);
      }
      showError("Updating Education Failed");
    }
  };

  const handleCreateEducation = async (event) => {
    event.preventDefault();
    try {
      await AxiosInstance.post(`api/resumes/${resumeId}/educations/create/`, education);
      showSuccess("Education Added");
      setEducation(defaultEducationState);
      setErrors(defaultEducationState);
      const response = await AxiosInstance.get(`api/resumes/${resumeId}/educations/`);
      setEducations(response.data);
      closeAddModal();
    } catch (error) {
      console.error("Error:", error);
      let errorMessages = "";
      if (error.response && error.response.data) {
        errorMessages = Object.values(error.response.data).join(" ");
        setErrors(error.response.data);
      }
      showError("Creating Education Failed");
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row justify-between items-center mb-4">
          <Label className="mr-4 w-[400px] text-1xl">Course Name</Label>
          <Input
            className="w-[400px]"
            type="text"
            name="course_name"
            value={education.course_name}
            onChange={handleEducationChange}
          />
        </div>
        <div className="mb-4">
          {errors.course_name && (
            <BigAlert
              className="ml-4"
              message={"Enter valid course name"}
              description={""}
              type="error"
            />
          )}
        </div>
        <div className="flex flex-row justify-between items-center mb-4">
          <Label className="mr-4 w-[400px] text-1xl">Start Date</Label>
          <DatePicker
            className="w-[400px]"
            name="start_date"
            value={education.start_date ? dayjs(education.start_date) : null}
            onChange={handleStartDateChange}
          />
        </div>
        <div className="mb-4">
          {errors.start_date && (
            <BigAlert
              className="ml-4"
              message={"Enter valid start date"}
              description={""}
              type="error"
            />
          )}
        </div>
        <div className="flex flex-row justify-between items-center mb-4">
          <Label className="mr-4 w-[400px] text-1xl">End Date</Label>
          <DatePicker
            className="w-[400px]"
            name="end_date"
            value={education.end_date ? dayjs(education.end_date) : null}
            onChange={handleEndDateChange}
          />
        </div>
        <div className="mb-4">
          {errors.end_date && (
            <BigAlert
              className="ml-4"
              message={"Enter valid end date"}
              description={""}
              type="error"
            />
          )}
        </div>
        <div className="flex flex-row justify-between items-center mb-4">
          <Label className="mr-4 w-[400px] text-1xl">Level</Label>
          <Select
            className="w-[420px]"
            name="level"
            placeholder="Select a level"
            value={education.level}
            onChange={(value) => {
              setEducation({ ...education, level: value });
            }}
          >
            <Select.Option value="HS">High School</Select.Option>
            <Select.Option value="BA">Bachelor</Select.Option>
            <Select.Option value="MA">Master</Select.Option>
            <Select.Option value="PHD">Doctorate</Select.Option>
          </Select>
        </div>
        <div className="mb-4">
          {errors.level && (
            <BigAlert
              className="ml-4"
              message={"Enter valid level"}
              description={""}
              type="error"
            />
          )}
        </div>
        <div className="flex flex-row justify-between items-center mb-4">
          <Label className="mr-4 w-[400px] text-1xl">Institution</Label>
          <Input
            className="w-[400px]"
            type="text"
            name="institution"
            value={education.institution}
            onChange={handleEducationChange}
          />
        </div>
        <div className="mb-4">
          {errors.institution && (
            <BigAlert
              className="ml-4"
              message={"Enter valid institution"}
              description={""}
              type="error"
            />
          )}
        </div>
        <div className="flex flex-row justify-between items-center mb-4">
          <Label className="mr-4 w-[400px] text-1xl">Grade</Label>
          <Input
            className="w-[400px]"
            type="text"
            name="grade"
            value={education.grade}
            onChange={handleEducationChange}
          />
        </div>
        <div className="mb-4">
          {errors.grade && (
            <BigAlert
              className="ml-4"
              message={"Enter valid grade"}
              description={""}
              type="error"
            />
          )}
        </div>
        {education.address && (
          <div className="flex flex-row w-full mt-8 justify-between items-center space-x-2">
            <div className="flex flex-col justify-between items-center mb-4 ">
              <Label className="w-full text-1xl">City</Label>
              <Input
                className="w-full"
                type="text"
                name="address.city"
                value={education.address.city}
                onChange={handleEducationChange}
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
                value={education.address.post_code}
                onChange={handleEducationChange}
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
                value={education.address.country}
                onChange={handleEducationChange}
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
        <Button variant="outline" className="w-full" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
export default EditEducationPage;
