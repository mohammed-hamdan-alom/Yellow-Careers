import React, { useState, useEffect } from "react";
import AxiosInstance from "../../Axios";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "./notificationUtils";
import Popup from "./Popup";
import EditLanguagePage from "./EditLanguagePage";

function Language({ resumeId }) {
  const [languages, setLanguages] = useState([]);
  const [createPopup, setCreatePopup] = useState(false);
  const [editPopup, setEditPopup] = useState(null);
  const [openPopupId, setOpenPopupId] = useState(null);

  useEffect(() => {
    if (!resumeId) {
      return;
    }
    AxiosInstance.get(`api/resumes/${resumeId}/languages/`)
      .then((response) => {
        setLanguages(response.data);
      })
      .catch((error) => console.error("Error:", error));
  }, [resumeId]);

  //Delete language
  const handleDeleteLanguage = (languageObj) => {
    console.log(languageObj);
    AxiosInstance.delete(
      `api/resumes/${resumeId}/languages/update/${languageObj.id}`
    )
      .then((response) => {
        showSuccess("Language Deleted");
        setLanguages((prevLanguages) =>
          prevLanguages.filter((item) => item !== languageObj)
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        showError("Deleting Language Failed");
      });
  };

  return (
    <div>
      <h2>Languages</h2>
      <ul>
        {languages.map((language, index) => (
          <li key={index}>
            <p>Language: {language.language}</p>
            <p>Spoken proficiency: {language.spoken_proficiency}</p>
            <p>Written proficiency: {language.written_proficiency}</p>
            <button
              onClick={() => {
                setEditPopup(true);
                setOpenPopupId(language.id);
              }}
            >
              Edit Language
            </button>
            <Popup
              trigger={editPopup && openPopupId === language.id}
              setTrigger={() => {
                setOpenPopupId(null); //or should this be setEditPopup instead?
              }}
            >
              <EditLanguagePage
                put={true}
                resumeId={resumeId}
                setLanguages={setLanguages}
                setButtonPopup={setEditPopup}
                languageId={language.id}
              />
            </Popup>
            <button onClick={() => handleDeleteLanguage(language)}>
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
          Add Language
        </button>
        <Popup trigger={createPopup} setTrigger={setCreatePopup}>
          <EditLanguagePage
            post={true}
            resumeId={resumeId}
            setLanguages={setLanguages}
            setButtonPopup={setCreatePopup}
          />
        </Popup>
      </div>
    </div>
  );
}

export default Language;
