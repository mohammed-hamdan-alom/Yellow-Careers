import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from "@/components/Alert/Alert";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusCircle, PlusCircle } from "lucide-react";

function SoftSkill({ resumeId }) {
  const [softSkills, setSoftSkills] = useState([]);
  const [softSkill, setSoftSkill] = useState([]);
  const [errors, setErrors] = useState({ softSkill: "" });

  // Fetch soft skills
  useEffect(() => {
    if (!resumeId) {
      return;
    }
    AxiosInstance.get(`api/resumes/${resumeId}/soft-skills/`)
      .then((response) => {
        setSoftSkills(response.data);
      })
      .catch((error) => console.error("Error:", error));
  }, [resumeId]);

  const handleSoftSkillChange = (event) => {
    setSoftSkill(event.target.value);
  };

  //Create soft skill
  const handleSubmitSoftSkills = (event) => {
    event.preventDefault();
    AxiosInstance.post(`api/resumes/${resumeId}/soft-skills/create/`, {
      skill: softSkill,
    })
      .then((response) => {
        showSuccess("Soft Skill Added");
        setSoftSkill("");
        setErrors({ softSkill: "" });
        setSoftSkills((prevSoftSkills) => [...prevSoftSkills, response.data]);
      })
      .catch((error) => {
        console.error("Error:", error);
        let errorMessages = "";
        if (error.response && error.response.data) {
          errorMessages = Object.values(error.response.data).join(" ");
          setErrors({ softSkill: error.response.data.skill[0] });
        }
        showError("Creating Soft Skill Failed");
      });
  };

  //Delete soft skill
  const handleDeleteSoftSkill = (skillObj) => {
    AxiosInstance.delete(
      `api/resumes/${resumeId}/soft-skills/update/${skillObj.id}`
    )
      .then((response) => {
        showSuccess("Soft Skill Deleted");
        setSoftSkills((prevSoftSkills) =>
          prevSoftSkills.filter((item) => item !== skillObj)
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        showError("Deleting Soft Skill Failed");
      });
  };

  return (
    <div className="mt-4 w-full flex flex-col justify-left">
      <Label className="text-3xl mb-4">Soft Skills</Label>
      <div className="">
        {softSkills.map((skill) => (
          <div
            key={skill.id}
            className="flex justify-between items-center w-full mb-4"
          >
            <Label className="">{skill.skill}</Label>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDeleteSoftSkill(skill)}
            >
              <MinusCircle className="w-5 h-5" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex flex-row items-center w-full mb-4">
        <Label className="text-1xl w-[200px]">Add soft skill:</Label>
        <Input
          className="w-full"
          type="text"
          name="softSkill"
          value={softSkill}
          onChange={handleSoftSkillChange}
        />
        <Button
          variant="secondary"
          className="w-10 h-10 ml-10"
          onClick={handleSubmitSoftSkills}
        >
          <PlusCircle />
        </Button>
      </div>
    </div>
  );
}
export default SoftSkill;