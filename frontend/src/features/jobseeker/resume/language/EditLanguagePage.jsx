import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "@/components/Alert/Alert"

function EditLanguagePage({
  put,
  post,
  resumeId,
  setLanguages,
  setButtonPopup,
  languageId,
}) {
  const defaultLanguageState = {
    language: "",
    spoken_proficiency: "",
    written_proficiency: "",
  };
  const [language, setLanguage] = useState(defaultLanguageState);
  const [errors, setErrors] = useState(defaultLanguageState);

  useEffect(() => {
    if (put) {
      AxiosInstance.get(
        `api/resumes/${resumeId}/languages/update/${languageId}`
      )
        .then((response) => {
          setLanguage(response.data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, []);

  const handleLanguageChange = (event) => {
    setLanguage({
      ...language,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    if (post) {
      handleCreateLanguage(event);
    } else if (put) {
      handleEditSubmit(event);
    } else {
      console.error(
        "Pass in POST or PUT as a prop to the EditLanguagePage component."
      );
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    AxiosInstance.put(
      `api/resumes/${resumeId}/languages/update/${languageId}`,
      language
    )
      .then((res) => {
        showSuccess("Language Updated");
        setErrors(defaultLanguageState);
        setLanguage(defaultLanguageState);
        AxiosInstance.get(`api/resumes/${resumeId}/languages/`)
          .then((response) => {
            setLanguages(response.data);
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
        showError("Updating Language Failed");
      });
  };

  const handleCreateLanguage = (event) => {
    event.preventDefault();
    AxiosInstance.post(`api/resumes/${resumeId}/languages/create/`, language)
      .then((response) => {
        showSuccess("Language Added");
        setLanguage(defaultLanguageState);
        setErrors(defaultLanguageState);
        AxiosInstance.get(`api/resumes/${resumeId}/languages/`)
          .then((response) => {
            setLanguages(response.data);
          })
          .catch((error) => console.error("Error:", error));

        setButtonPopup(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        let errorMessages = "";
        if (error.response && error.response.data) {
          errorMessages = Object.values(error.response.data).join(" ");
          setErrors(error.response.data);
        }
        showError("Creating Language Failed");
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Language</label>
          <input
            type="text"
            name="language"
            value={language.language}
            onChange={handleLanguageChange}
          />
          {errors.language && <p>{errors.language}</p>}
        </div>
        <div>
          <label>Spoken Proficiency:</label>
          <select
            name="spoken_proficiency"
            value={language.spoken_proficiency}
            onChange={handleLanguageChange}
          >
            <option value="">Select Proficiency</option>
            <option value="B">Basic</option>
            <option value="I">Intermediate</option>
            <option value="A">Advanced</option>
            <option value="F">Fluent</option>
          </select>
          {errors.spoken_proficiency && <p>{errors.spoken_proficiency}</p>}
        </div>
        <div>
          <label>Written Proficiency:</label>
          <select
            name="written_proficiency"
            value={language.written_proficiency}
            onChange={handleLanguageChange}
          >
            <option value="">Select Proficiency</option>
            <option value="B">Basic</option>
            <option value="I">Intermediate</option>
            <option value="A">Advanced</option>
            <option value="F">Fluent</option>
          </select>
          {errors.written_proficiency && <p>{errors.written_proficiency}</p>}
        </div>{" "}
        <br />
        <button>Submit</button>
      </form>
    </div>
  );
}
export default EditLanguagePage;
