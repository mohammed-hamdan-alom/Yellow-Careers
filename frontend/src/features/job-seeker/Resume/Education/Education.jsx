import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from "@/components/Alert/Alert";
import { Modal } from "antd";
import EditEducationPage from "./EditEducationPage";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SquarePen, MinusCircle } from "lucide-react";

function Education({ resumeId }) {
  const [educations, setEducations] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const showAddModal = () => {
    setIsAddModalOpen(true);
  };

  const showEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  useEffect(() => {
    const fetchEducations = async () => {
      if (!resumeId) {
        return;
      }
      try {
        const response = await AxiosInstance.get(`api/resumes/${resumeId}/educations/`);
        setEducations(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchEducations();
  }, [resumeId]);

  //Delete education
  const handleDeleteEducation = (educationObj) => {
    try {
      AxiosInstance.delete(`api/resumes/${resumeId}/educations/update/${educationObj.id}`);
      showSuccess("Education Deleted");
      setEducations((prevEducations) => prevEducations.filter((item) => item !== educationObj));
    } catch (error) {
      console.error("Error:", error);
      showError("Deleting Education Failed");
    }
  };

  return (
    <div className="mt-4 w-full flex flex-col justify-left mr-10">
      <Label className="text-3xl mb-4">Education</Label>
      <div>
        {educations.map((education) => (
          <div key={education.id} className="flex flex-col items-center justify-between mb-4">
            {console.log(education.id)}
            <div className="flex flex-col w-full outline rounded m-3 p-2">
              <Label className="text-1xl">Course: {education.course_name}</Label>
              <Label className="text-1xl">Institution: {education.institution}</Label>
              <Label className="text-1xl">Level: {education.level}</Label>
              <Label className="text-1xl">Grade: {education.grade}</Label>
            </div>

            <div className="flex flex-row w-full items-center">
              <Button
                data-testid="edit-button"
                variant="secondary"
                className="mr-4"
                onClick={showEditModal}
              >
                <SquarePen className="w-5 h-5 mr-2" />
                Edit
              </Button>
              <Modal
                title="Edit Education"
                footer={null}
                open={isEditModalOpen}
                onOk={() => setIsEditModalOpen(false)}
                onCancel={() => setIsEditModalOpen(false)}
              >
                <EditEducationPage
                  post={false}
                  put={true}
                  resumeId={resumeId}
                  educationId={education.id}
                  setEducations={setEducations}
                  closeEditModal={closeEditModal}
                />
              </Modal>
              <Button
                data-testid="delete-button"
                variant="destructive"
                onClick={() => {
                  handleDeleteEducation(education);
                }}
              >
                <MinusCircle className="w-5 h-5 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <Button variant="outline" onClick={showAddModal}>
          Add Education
        </Button>
        <Modal
          title="Add Education"
          open={isAddModalOpen}
          footer={null}
          onOk={() => setIsAddModalOpen(false)}
          onCancel={() => setIsAddModalOpen(false)}
        >
          <EditEducationPage
            post={true}
            put={false}
            resumeId={resumeId}
            setEducations={setEducations}
            closeAddModal={closeAddModal}
          />
        </Modal>
      </div>
    </div>
  );
}

export default Education;
