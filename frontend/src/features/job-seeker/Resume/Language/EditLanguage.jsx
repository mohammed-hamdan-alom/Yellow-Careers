import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from "@/components/Alert/alert";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "antd";
import { Select } from "antd";
import BigAlert from "@/components/Alert/BigAlert";

function EditLanguage({
  put,
  post,
  resumeId,
  setLanguages,
  languageId,
  closeAddModal,
  closeEditModal,
}) {
  const SkillLevelOptions = [
    { value: "B", label: "Basic" },
    { value: "I", label: "Intermediate" },
    { value: "A", label: "Advanced" },
    { value: "F", label: "Fluent" },
  ];

  const defaultLanguageState = {
    language: "",
    spoken_proficiency: "",
    written_proficiency: "",
  };
  const [language, setLanguage] = useState(defaultLanguageState);
  const [errors, setErrors] = useState(defaultLanguageState);

  useEffect(() => {
    const fetchLanguage = async () => {
      if (put) {
        try {
          const response = await AxiosInstance.get(
            `api/resumes/${resumeId}/languages/update/${languageId}`
          );
          setLanguage(response.data);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    fetchLanguage();
  }, []);

  const handleLanguageChange = (event) => {
    setLanguage({
      ...language,
      [event.target.name]: event.target.value,
    });
  };

  const handleSpokenProfiecienyChange = (value) => {
    if (value) {
      setLanguage({
        ...language,
        spoken_proficiency: value,
      });
    }
  };

  const handleWrittenProfiecienyChange = (value) => {
    if (value) {
      setLanguage({
        ...language,
        written_proficiency: value,
      });
    }
  };

  const handleSubmit = (event) => {
    if (post) {
      handleCreateLanguage(event);
    } else if (put) {
      handleEditSubmit(event);
    } else {
      console.error("Pass in POST or PUT as a prop to the EditLanguagePage component.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await AxiosInstance.put(`api/resumes/${resumeId}/languages/update/${languageId}`, language);
      showSuccess("Language Updated");
      setErrors(defaultLanguageState);
      setLanguage(defaultLanguageState);

      const response = await AxiosInstance.get(`api/resumes/${resumeId}/languages/`);
      setLanguages(response.data);
      location.reload();
      closeEditModal();
    } catch (error) {
      console.error(error);
      let errorMessages = "";
      if (error.response && error.response.data) {
        errorMessages = Object.values(error.response.data).join(" ");
        setErrors(error.response.data);
      }
      showError("Updating Language Failed");
      closeEditModal();
    }
  };

  const handleCreateLanguage = async (event) => {
    event.preventDefault();
    try {
      await AxiosInstance.post(`api/resumes/${resumeId}/languages/create/`, language);
      showSuccess("Language Added");
      setLanguage(defaultLanguageState);
      setErrors(defaultLanguageState);

      const response = await AxiosInstance.get(`api/resumes/${resumeId}/languages/`);
      setLanguages(response.data);
      closeAddModal();
    } catch (error) {
      console.error("Error:", error);
      let errorMessages = "";
      if (error.response && error.response.data) {
        errorMessages = Object.values(error.response.data).join(" ");
        setErrors(error.response.data);
      }
      showError("Creating Language Failed");
      closeAddModal();
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col justify-between items-left mb-4">
          <Label className="text-1xl">Enter Language:</Label>
          <Input
            className="w-full"
            placeholder="Enter Language"
            type="text"
            name="language"
            value={language.language}
            onChange={handleLanguageChange}
          />
        </div>
        <div className="mb-4">
          {errors.language && (
            <BigAlert
              className="ml-4"
              message={"Enter valid language"}
              description={""}
              type="error"
            />
          )}
        </div>
        <div className="flex flex-col justify-between items-left mb-4">
          <Label className="text-1xl">Spoken Proficiency:</Label>
          <Select
            className="w-full"
            name="spoken_proficiency"
            placeholder="Select Spoken Proficiency"
            value={language.spoken_proficiency}
            options={SkillLevelOptions}
            onChange={handleSpokenProfiecienyChange}
          ></Select>
        </div>
        <div className="mb-4">
          {errors.spoken_proficiency && (
            <BigAlert
              className="ml-4"
              message={"Cannot leave blank"}
              description={""}
              type="error"
            />
          )}
        </div>
        <div className="flex flex-col justify-between items-left mb-4">
          <Label className="text-1xl">
            Written Proficiency:
          </Label>
          <Select
            className="w-full"
            name="written_proficiency"
            placeholder="Select Written Proficiency"
            value={language.written_proficiency}
            options={SkillLevelOptions}
            onChange={handleWrittenProfiecienyChange}
          ></Select>
        </div>
        <div className="mb-4">
          {errors.written_proficiency && (
            <BigAlert
              className="ml-4"
              message={"Cannot leave blank"}
              description={""}
              type="error"
            />
          )}
        </div>
        <Button type="submit" variant="outline" className="w-full mt-8">
          Submit
        </Button>
      </form>
    </div>
  );
}
export default EditLanguage;
