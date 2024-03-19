import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from "@/components/Alert/Alert";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusCircle, PlusCircle } from "lucide-react";
import { SquarePen } from "lucide-react";

function TechnicalSkill({ resumeId }) {
  const [technicalSkills, setTechnicalSkills] = useState([]);
  const [technicalSkill, setTechnicalSkill] = useState([]);
  const [errors, setErrors] = useState({ technicalSkill: "" });

  // Fetch technical skills
  useEffect(() => {
    if (!resumeId) {
      return;
    }
    AxiosInstance.get(`api/resumes/${resumeId}/technical-skills/`)
      .then((response) => {
        setTechnicalSkills(response.data);
      })
      .catch((error) => console.error("Error:", error));
  }, [resumeId]);

  const handleTechnicalSkillChange = (event) => {
    setTechnicalSkill(event.target.value);
  };

  //Create technical skill
  const handleSubmitTechnicalSkills = (event) => {
    event.preventDefault();
    AxiosInstance.post(
      `http://localhost:8000/api/resumes/${resumeId}/technical-skills/create/`,
      {
        skill: technicalSkill,
      }
    )
      .then((response) => {
        showSuccess("Technical Skill Added");
        setTechnicalSkill("");
        setErrors({ technicalSkill: "" });
        setTechnicalSkills((prevTechnicalSkills) => [
          ...prevTechnicalSkills,
          response.data,
        ]);
      })
      .catch((error) => {
        console.error("Error:", error);
        let errorMessages = "";
        if (error.response && error.response.data) {
          errorMessages = Object.values(error.response.data).join(" ");
          setErrors({ technicalSkill: error.response.data.skill[0] });
        }
        showError("Creating Technical Skill Failed");
      });
  };

  //Delete technical skill
  const handleDeleteTechnicalSkill = (skillObj) => {
    AxiosInstance.delete(
      `api/resumes/${resumeId}/technical-skills/update/${skillObj.id}`
    )
      .then((response) => {
        showSuccess("Technical Skill Deleted");
        setTechnicalSkills((prevSoftSkills) =>
          prevSoftSkills.filter((item) => item !== skillObj)
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        showError("Deleting Technical Skill Failed");
      });
  };

  return (
    <div className="mt-4 w-full flex flex-col justify-left">
      <Label className="text-3xl mb-4">Technical Skills</Label>
      <div>
        {technicalSkills.map((skill) => (
          <div
            key={skill.id}
            className="flex flex-row items-center justify-between mb-4"
          >
            <div>
              <Label className="text-1xl">{skill.skill}</Label>
            </div>
            <div className="flex flex-row items-center">
              <Button
                size="icon"
                variant="destructive"
                onClick={() => handleDeleteTechnicalSkill(skill)}
              >
                <MinusCircle />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row items-center w-full mb-4">
        <Label className="text-1xl w-[180px]">Add technical skill:</Label>
        <Input
          className="w-[280px]"
          value={technicalSkill}
          onChange={handleTechnicalSkillChange}
        />
        <Button
          size="icon"
          className="w-10 h-10 ml-4"
          variant="secondary"
          onClick={handleSubmitTechnicalSkills}
        >
          <PlusCircle />
        </Button>
      </div>
    </div>
  );
}
export default TechnicalSkill;
