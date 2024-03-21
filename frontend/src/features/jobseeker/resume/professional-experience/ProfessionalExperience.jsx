import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "@/components/Alert/Alert";
import Popup from "../Popup/Popup";
import EditProfessionalExperience from "./EditProfessionalExperiencePage";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SquarePen, MinusCircle } from "lucide-react";

function ProfessionalExperience({ resumeId }) {
  const [professionalExperiences, setProfessionalExperiences] = useState([]);
  const [createPopup, setCreatePopup] = useState(false);
  const [editPopup, setEditPopup] = useState(null);
  const [openPopupId, setOpenPopupId] = useState(null);

  useEffect(() => {
    const fetchProfessionalExperiences = async () => {
      if (!resumeId) {
        return;
      }
      try {
        const response = await AxiosInstance.get(`api/resumes/${resumeId}/professional-experiences/`);
        setProfessionalExperiences(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    fetchProfessionalExperiences();
  }, [resumeId]);
  
  const handleDeleteProfessionalExperience = async (professionalExperienceObj) => {
    try {
      await AxiosInstance.delete(`api/resumes/${resumeId}/professional-experiences/update/${professionalExperienceObj.id}`);
      showSuccess("Professional Experience Deleted");
      setProfessionalExperiences((prevprofessionalExperiences) =>
        prevprofessionalExperiences.filter((item) => item !== professionalExperienceObj)
      );
    } catch (error) {
      console.error("Error:", error);
      showError("Deleting Professional Experience Failed");
    }
  };

  return (
    <div className="mt-4 w-full flex flex-col justify-left">
      <Label className="text-3xl mb-4">Professional Experience</Label>
      <div>
        {professionalExperiences.map((professionalExperience) => (
          <div
            key={professionalExperience.id}
            className="flex flex-row items-center justify-between mb-4"
          >
            <div>
              <Label className="text-1xl">{professionalExperience.title}</Label>
            </div>
            <div className="flex flex-row items-center">
              <Button
                className="mr-4"
                variant="secondary"
                size="icon"
                onClick={() => {
                  setEditPopup(true);
                  setOpenPopupId(professionalExperience.id);
                }}
              >
                <SquarePen size={20} />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => {
                  handleDeleteProfessionalExperience(professionalExperience);
                }}
              >
                <MinusCircle size={20} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <Button
          variant="outline"
          onClick={() => {
            setCreatePopup(true);
          }}
        >
          Add Professional Experience
        </Button>
        <Popup trigger={createPopup} setTrigger={setCreatePopup}>
          <EditProfessionalExperience
            post={true}
            resumeId={resumeId}
            setProfessionalExperiences={setProfessionalExperiences}
            setButtonPopup={setCreatePopup}
          />
        </Popup>
      </div>
    </div>
  );
}
export default ProfessionalExperience;
