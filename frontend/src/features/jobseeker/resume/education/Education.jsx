import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "@/components/Alert/Alert";
import Popup from "../Popup/Popup";
import EditEducationPage from "./EditEducationPage";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SquarePen, MinusCircle } from "lucide-react";

function Education({ resumeId }) {
  const [educations, setEducations] = useState([]);
  const [createPopup, setCreatePopup] = useState(false);
  const [editPopup, setEditPopup] = useState(null);
  const [openPopupId, setOpenPopupId] = useState(null);

  useEffect(() => {
    if (!resumeId) {
      return;
    }
    AxiosInstance.get(`api/resumes/${resumeId}/educations/`)
      .then((response) => {
        setEducations(response.data);
      })
      .catch((error) => console.error("Error:", error));
  }, [resumeId]);

  //Delete education
  const handleDeleteEducation = (educationObj) => {
    AxiosInstance.delete(
      `http://localhost:8000/api/resumes/${resumeId}/educations/update/${educationObj.id}`
    )
      .then((response) => {
        showSuccess("Education Deleted");
        setEducations((prevEducations) =>
          prevEducations.filter((item) => item !== educationObj)
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        showError("Deleting Education Failed");
      });
  };

  return (
    <div className="mt-4 w-full flex flex-col justify-left mr-10">
      <Label className="text-3xl mb-4">Education</Label>
      <div>
        {educations.map((education) => (
          <div
            key={education.id}
            className="flex flex-row items-center justify-between mb-4"
          >
            <div>
              <Label className="text-1xl">{education.school}</Label>
            </div>
            <div className="flex flex-row items-center">
              <Button
                size="icon"
                variant="secondary"
                className="mr-4"
                onClick={() => {
                  setEditPopup(true);
                  setOpenPopupId(education.id);
                }}
              >
                <SquarePen className="w-5 h-5"/>
              </Button>
              <Popup trigger={editPopup} setTrigger={setEditPopup}>
                <EditEducationPage
                  education={education}
                  resumeId={resumeId}
                  setEducations={setEducations}
                  setButtonPopup={setEditPopup}
                />
              </Popup>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => {
                  handleDeleteEducation(education);
                }}
              >
                <MinusCircle className="w-5 h-5"/>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <Button
          variant="outline"
          onClick={() => setCreatePopup(true)}
        >
          Add Education 
        </Button>
        <Popup trigger={createPopup} setTrigger={setCreatePopup}>
          <EditEducationPage
            post={true}
            resumeId={resumeId}
            setEducations={setEducations}
            setButtonPopup={setCreatePopup}
          />
        </Popup>
      </div>
    </div>
  );
}

export default Education;
