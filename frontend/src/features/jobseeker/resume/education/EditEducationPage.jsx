import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from "@/components/Alert/Alert";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "antd";
import { DatePicker } from "antd";
import { Select } from "antd";
const { RangePicker } = DatePicker;
import BigAlert from "@/components/Alert/BigAlert";

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

  const handleDateChange = (dateStrings) => {
    setEducation({
      ...education,
      start_date: dateStrings[0],
      end_date: dateStrings[1],
    });
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
    <div className="p-12">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row justify-between items-center mb-4">
          <Label className="mr-4 w-[400px] text-2xl">Start - End Dates</Label>
          <RangePicker
            className="w-[400px]"
            id={{ start: education.start_date, end: education.end_date }}
            onChange={(dateStrings) => {
              handleDateChange(dateStrings);
            }}
          />
        </div>
        <div className="mb-4">
          {errors.start_date ||
            (errors.end_date && (
              <BigAlert
                className="ml-4"
                message={"Enter valid date"}
                description={""}
                type="error"
              />
            ))}
        </div>

        <div className="flex flex-row justify-between items-center mb-4">
          <Label className="mr-4 w-[400px] text-2xl">Level</Label>
          <Select
            className="w-[420px]"
            name="level"
            placeholder="Select a level"
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
          <Label className="mr-4 w-[400px] text-2xl">Institution</Label>
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
          <Label className="mr-4 w-[400px] text-2xl">Grade</Label>
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
          <>
            <div className="flex flex-row justify-between items-center mb-4">
              <Label className="mr-4 w-[400px] text-2xl">City</Label>
              <Input
                className="w-[400px]"
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
            <div className="flex flex-row justify-between items-center mb-4">
              <Label className="mr-4 w-[400px] text-2xl">Post Code</Label>
              <Input
                className="w-[400px]"
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
            <div className="flex flex-row justify-between items-center mb-4">
              <Label className="mr-4 w-[400px] text-2xl">Country</Label>
              <Input
                className="w-[400px]"
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
          </>
        )}
        <br />
        <Button
          variant="outline"
          className="w-full"
          type="submit"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
export default EditEducationPage;