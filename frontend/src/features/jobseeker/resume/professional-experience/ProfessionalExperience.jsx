import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import EditProfessionalExperience from "./EditProfessionalExperiencePage";

import { Modal } from "antd";
import { showError, showSuccess } from "@/components/Alert/Alert";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SquarePen, MinusCircle } from "lucide-react";

function ProfessionalExperience({ resumeId }) {
  const [professionalExperiences, setProfessionalExperiences] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const showAddModal = () => {
    setIsAddModalOpen(true);
  };

  const showEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    console.log("Edit modal closed");
    setIsEditModalOpen(false);
  };

  const closeAddModal = () => {
    console.log("Add modal closed");
    setIsAddModalOpen(false);
  };

  useEffect(() => {
    const fetchProfessionalExperiences = async () => {
      if (!resumeId) {
        return;
      }
      try {
        const response = await AxiosInstance.get(
          `api/resumes/${resumeId}/professional-experiences/`
        );
        setProfessionalExperiences(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProfessionalExperiences();
  }, [resumeId]);

  const handleDeleteProfessionalExperience = async (
    professionalExperienceObj
  ) => {
    try {
      await AxiosInstance.delete(
        `api/resumes/${resumeId}/professional-experiences/update/${professionalExperienceObj.id}`
      );
      showSuccess("Professional Experience Deleted");
      setProfessionalExperiences((prevprofessionalExperiences) =>
        prevprofessionalExperiences.filter(
          (item) => item !== professionalExperienceObj
        )
      );
    } catch (error) {
      console.error("Error:", error);
      showError("Deleting Professional Experience Failed");
    }
  };

  return (
    <div className="mt-12 w-full flex flex-col justify-left mr-10">
      <Label className="text-3xl mb-4">Professional Experience</Label>
      <div>
        {professionalExperiences.map((professionalExperience) => (
          <div
            key={professionalExperience.id}
            className="flex flex-col items-center justify-between mb-4"
          >
            <div className="flex flex-col w-full outline rounded m-3 p-2">
              <Label className="text-1xl">
                Job Title: {professionalExperience.position}
              </Label>
              <Label className="text-1xl">
                Company: {professionalExperience.company}
              </Label>
            </div>

            <div className="flex flex-row w-full items-center justify-end">
              <Button
                className="mr-4"
                variant="secondary"
                onClick={showEditModal}
              >
                <SquarePen size={20} className="mr-2" />
                Edit
              </Button>

              <Modal
                title="Edit Professional Experience"
                open={isEditModalOpen}
                onOpen={showEditModal}
                onCancel={closeEditModal}
                footer={null}
              >
                <EditProfessionalExperience
                  put={true}
                  professionalExperienceId={professionalExperience.id}
                  resumeId={resumeId}
                  setProfessionalExperiences={setProfessionalExperiences}
                  closeEditModal={closeEditModal}
                />
              </Modal>
              <Button
                variant="destructive"
                onClick={() => {
                  handleDeleteProfessionalExperience(professionalExperience);
                }}
              >
                <MinusCircle className="mr-2" size={20} />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <Button variant="outline" className="w-full" onClick={showAddModal}>
          + Add Professional Experience
        </Button>
        <Modal
          title="Add Professional Experience"
          open={isAddModalOpen}
          onOpen={showAddModal}
          onCancel={closeAddModal}
          footer={null}
        >
          <EditProfessionalExperience
            post={true}
            put={false}
            resumeId={resumeId}
            setProfessionalExperiences={setProfessionalExperiences}
            closeAddModal={closeAddModal}
          />
        </Modal>
      </div>
    </div>
  );
}
export default ProfessionalExperience;
