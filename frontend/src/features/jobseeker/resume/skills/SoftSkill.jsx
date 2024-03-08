import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from "@/components/Alert/Alert"

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
    <div>
      <h2>Soft Skills</h2>
      <ul>
        {softSkills.map((skillObj, index) => (
          <li key={index}>
            {skillObj.skill}
            <button onClick={() => handleDeleteSoftSkill(skillObj)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmitSoftSkills}>
        <div>
          <label>
            Soft Skill:
            <input
              type="text"
              name="softSkill"
              value={softSkill}
              onChange={handleSoftSkillChange}
            />
            {errors.softSkill && <p>{errors.softSkill}</p>}
          </label>
        </div>
        <button type="submit">Add Soft Skill</button>
      </form>
    </div>
  );
}
export default SoftSkill;
