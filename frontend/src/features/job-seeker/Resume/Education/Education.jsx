import React, { useState, useEffect } from "react";
import EditEducationPage from "./EditEducationPage";
import AxiosInstance from "@/utils/AxiosInstance";
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
import { SquarePen, MinusCircle, Calendar, MapPin } from "lucide-react";
import { Modal } from "antd";

function Education({ resumeId }) {
  const [educations, setEducations] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);

  const showAddModal = () => {
    setIsAddModalOpen(true);
  };

  const showEditModal = (education) => {
    setEditingEducation(education);
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
          <div className="my-6" key={education.id}>
            <Card>
              <CardHeader>
                <CardTitle>{education.course_name}</CardTitle>
                <CardDescription>
                  <div className="flex flex-row items-center mt-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(education.start_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }) +
                      " - " +
                      new Date(education.end_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                  </div>
                  <div className="flex flex-row">
                    <MapPin className="w-4 h-4 mr-1" />{education.address.city}, {education.address.country}{" "}
                    {education.address.post_code}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <div>
                    <Label className="text-1xl">{education.institution}</Label>
                  </div>
                  <div>
                    <Label className="text-1xl">Level: {education.level}</Label>
                  </div>
                  <div>
                    <Label className="text-1xl">Grade: {education.grade}</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex flex-row w-full items-center justify-start">
                  <Button
                    variant="secondary"
                    className="mr-4"
                    onClick={() => showEditModal(education)}
                  >
                    <SquarePen className="w-5 h-5 mr-2" />
                    Edit
                  </Button>
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

                  <Modal
                    title="Edit Education"
                    footer={null}
                    open={isEditModalOpen}
                    onOk={closeEditModal}
                    onCancel={closeEditModal}
                  >
                    <EditEducationPage
                      post={false}
                      put={true}
                      resumeId={resumeId}
                      educationId={editingEducation ? editingEducation.id : null}
                      setEducations={setEducations}
                      closeEditModal={closeEditModal}
                    />
                  </Modal>
                </div>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>

      <div>
        <Button variant="outline" className="w-full" onClick={showAddModal}>
          + Add Education
        </Button>
        <Modal
          title="Add Education"
          open={isAddModalOpen}
          footer={null}
          onOk={closeAddModal}
          onCancel={closeAddModal}
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
