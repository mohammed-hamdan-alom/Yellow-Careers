import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import EditProfessionalExperience from "./EditProfessionalExperiencePage";

import { Modal } from "antd";
import { showError, showSuccess } from "@/components/Alert/alert";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { SquarePen, MinusCircle, MapPin, Calendar } from "lucide-react";

function ProfessionalExperience({ resumeId }) {
  const [professionalExperiences, setProfessionalExperiences] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProfessionalExperience, setEditingProfessionalExperience] = useState(null);

  const showAddModal = () => {
    setIsAddModalOpen(true);
  };

  const showEditModal = (professionalExperience) => {
    setEditingProfessionalExperience(professionalExperience);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const closeAddModal = () => {
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

  const handleDeleteProfessionalExperience = async (professionalExperienceObj) => {
    try {
      await AxiosInstance.delete(
        `api/resumes/${resumeId}/professional-experiences/update/${professionalExperienceObj.id}`
      );
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
    <div className="mt-12 w-full flex flex-col justify-left mr-10">
      <Label className="text-3xl mb-4">Professional Experience</Label>
      <div>
        {professionalExperiences.map((professionalExperience) => (
          <div className='my-6' key={professionalExperience.id}>
            <Card>
              <CardHeader>
                <CardTitle>{professionalExperience.position}, {professionalExperience.company}</CardTitle>
                <CardDescription>
                 <div className="flex flex-row items-center mt-2">
                  <Calendar className="w-4 h-4 mr-1"/>
                  {new Date(professionalExperience.start_date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }) +
                    " - " +
                    new Date(professionalExperience.end_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex flex-row">
                    <MapPin className="w-4 h-4 mr-1"/>{professionalExperience.address.city}, {professionalExperience.address.country}{" "}
                    {professionalExperience.address.post_code}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {professionalExperience.description}
              </CardContent>
              <CardFooter>
                <div className="flex flex-row items-center justify-start">
                  <Button
                    variant="secondary"
                    className="mr-4"
                    onClick={() => showEditModal(professionalExperience)}
                  >
                    <SquarePen className="w-5 h-5 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant='destructive'
                    className="mr-4"
                    onClick={() => handleDeleteProfessionalExperience(professionalExperience)}
                  >
                    <MinusCircle className="w-5 h-5 mr-2" />
                    Delete
                  </Button>
                  <Modal
                    title="Edit Professional Experience"
                    open={isEditModalOpen}
                    onOk={closeEditModal}
                    onCancel={closeEditModal}
                    footer={null}
                  >
                    <EditProfessionalExperience
                      post={false}
                      put={true}
                      resumeId={resumeId}
                      professionalExperienceId={editingProfessionalExperience ? editingProfessionalExperience.id : null}
                      setProfessionalExperiences={setProfessionalExperiences}
                      closeEditModal={closeEditModal}
                    />
                  </Modal>
                </div>
              </CardFooter>
            </Card>
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
          onOk={closeAddModal}
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
