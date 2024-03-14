import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from "@/components/Alert/Alert"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";


function ResumeForm({ resumeId }) {
  const defaultResumeState = {
    github: "",
    linkedin: "",
    about: "",
    experience: "",
  };

  const [resume, setResume] = useState(defaultResumeState);
  const [errors, setErrors] = useState(defaultResumeState);

  useEffect(() => {
    if (!resumeId) {
      return;
    }
    AxiosInstance.get(`api/resumes/${resumeId}/update/`)
      .then((response) => {
        setResume(response.data);
      })
      .catch((error) => console.error("Error:", error));
  }, [resumeId]);

  const handleResumeChange = (event) => {
    setResume({ ...resume, [event.target.name]: event.target.value });
  };

  const handleSubmitResume = (event) => {
    event.preventDefault();
    AxiosInstance.put(`api/resumes/${resumeId}/update/`, resume)
      .then((response) => {
        showSuccess("Resume Updated");
        setErrors(defaultResumeState);
      })
      .catch((error) => {
        console.error("Error:", error);
        let errorMessages = "";
        if (error.response && error.response.data) {
          errorMessages = Object.values(error.response.data).join(" ");
          setErrors(error.response.data);
        }
        showError("Updating Resume Failed");
      });
  };

  return (
    <div className="mt-4 w-full flex flex-col justify-left mr-10">
      <Label className="text-3xl mb-4">Update Your Resume</Label>
      <form onSubmit={handleSubmitResume}>
        <div className="flex space-x-4">
          <div className="w-1/2">
            <Label className='text-1xl'>Github:</Label>
            <Input type="text" name="github" value={resume.github} onChange={handleResumeChange} />
          </div>
          <div className="w-1/2">
            <Label className='text-1xl'>LinkedIn:</Label>
            <Input type="text" name="linkedin" value={resume.linkedin} onChange={handleResumeChange} />
          </div>
        </div>
        <div className="mt-4">
          <Label className='text-1xl'>About:</Label>
          <Textarea name="about" value={resume.about} onChange={handleResumeChange} />
        </div>
        <div className="mt-4">
          <Label className='text-1xl'>Experience:</Label>
          <Textarea name="experience" value={resume.experience} onChange={handleResumeChange} />
        </div>
        <Button type="submit" className="mt-4">Update Resume</Button>
      </form>
    </div>
  );
}

export default ResumeForm;
