import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "@/components/Alert/Alert";
import Popup from "../Popup/Popup";
import EditLanguagePage from "./EditLanguagePage";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SquarePen, MinusCircle } from "lucide-react";

function Language({ resumeId }) {
  const [languages, setLanguages] = useState([]);
  const [createPopup, setCreatePopup] = useState(false);
  const [editPopup, setEditPopup] = useState(null);
  const [openPopupId, setOpenPopupId] = useState(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      if (!resumeId) {
        return;
      }
      try {
        const response = await AxiosInstance.get(`api/resumes/${resumeId}/languages/`);
        setLanguages(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchLanguages();
  }, [resumeId]);

  //Delete language
  const handleDeleteLanguage = async (languageObj) => {
    try {
      await AxiosInstance.delete(`api/resumes/${resumeId}/languages/update/${languageObj.id}`);
      showSuccess("Language Deleted");
      setLanguages((prevLanguages) =>
        prevLanguages.filter((item) => item !== languageObj)
      );
    } catch (error) {
      console.error("Error:", error);
      showError("Deleting Language Failed");
    }
  };

  return (
    <div className="mt-4 w-full flex flex-col justify-left mr-10">
      <Label className="text-3xl mb-4">Languages</Label>
      <div>
        {languages.map((language) => (
          <div
            key={language.id}
            className="flex flex-row items-center justify-between mb-4"
          >
            <div>
              <Label className="text-1xl">{language.language}</Label>
            </div>
            <div className="flex flex-row items-center">
              <Button
                className="mr-4"
                variant="secondary"
                size="icon"
                onClick={() => {
                  setEditPopup(true);
                  setOpenPopupId(language.id);
                }}
              >
                <SquarePen className="w-5 h-5" />
              </Button>
              <Button
                className=""
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteLanguage(language)}
              >
                <MinusCircle />
              </Button>
            </div>
            <Popup trigger={editPopup} setTrigger={setEditPopup}>
              <EditLanguagePage
                post={false}
                language={language}
                resumeId={resumeId}
                setLanguages={setLanguages}
                setButtonPopup={setEditPopup}
              />
            </Popup>
          </div>
        ))}
      </div>
      <div>
        <Button variant='outline' onClick={() => setCreatePopup(true)}>Add Language</Button>
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
