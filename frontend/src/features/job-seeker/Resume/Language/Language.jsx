import React, { useState, useEffect } from "react";
import EditLanguage from "./EditLanguage";
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from "@/components/Alert/alert";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SquarePen, MinusCircle } from "lucide-react";
import { Modal } from "antd";

function Language({ resumeId }) {
  const [languages, setLanguages] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLanguageId, setEditingLanguageId] = useState(null);

  const SkillLevelOptions = [
    { value: "B", label: "Basic" },
    { value: "I", label: "Intermediate" },
    { value: "A", label: "Advanced" },
    { value: "F", label: "Fluent" },
  ];

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
    const fetchLanguages = async () => {
      if (!resumeId) {
        return;
      }
      try {
        const response = await AxiosInstance.get(
          `api/resumes/${resumeId}/languages/`
        );
        setLanguages(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchLanguages();
  }, [resumeId]);

  //Delete language
  const handleDeleteLanguage = async (languageObj) => {
    try {
      await AxiosInstance.delete(
        `api/resumes/${resumeId}/languages/update/${languageObj.id}`
      );
      showSuccess("Language Deleted");
      setLanguages((prevLanguages) =>
        prevLanguages.filter((item) => item !== languageObj)
      );
    } catch (error) {
      console.error("Error:", error);
      showError("Deleting Language Failed");
    }
  };

  return (
    <div className="mt-4 w-full flex flex-col justify-left mr-10">
      <Label className="text-3xl mb-4">Languages</Label>
      <div>
        {languages.map((language) => (
          <div
            key={language.id}
            className="flex flex-row items-center justify-between mb-4"
          >
            <div className="flex flex-col outline-slate-400 w-full mr-5 rounded p-2">
              <Label className="text-1xl">{language.language}</Label>
              <Label className="text-1xl">
                Spoken:{" "}
                {
                  SkillLevelOptions.find(
                    (option) => option.value === language.spoken_proficiency
                  )?.label
                }
              </Label>
              <Label className="text-1xl">
                Written:{" "}
                {
                  SkillLevelOptions.find(
                    (option) => option.value === language.written_proficiency
                  )?.label
                }
              </Label>
            </div>
            <div className="flex flex-row items-center">
              <Button
                className="mr-4"
                variant="secondary"
                onClick={() => {
                  setEditingLanguageId(language.id);
                  showEditModal();
                }}
              >
                <SquarePen className="w-5 h-5 mr-1" />
                Edit
              </Button>
              <Modal
                title="Edit Language"
                footer={null}
                open={isEditModalOpen}
                onOk={closeEditModal}
                onCancel={closeEditModal}
              >
                <EditLanguage
                  post={false}
                  put={true}
                  resumeId={resumeId}
                  languageId={editingLanguageId}
                  setLanguages={setLanguages}
                  closeEditModal={closeEditModal}
                />
              </Modal>
              <Button
                data-testid="delete-button"
                variant="destructive"
                onClick={() => handleDeleteLanguage(language)}
              >
                <MinusCircle className="mr-1"/>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Button variant="outline" className='w-full' onClick={showAddModal}>
          + Add Language
        </Button>
        <Modal
          title="Add Language"
          open={isAddModalOpen}
          footer={null}
          onOk={closeAddModal}
          onCancel={closeAddModal}
        >
          <EditLanguage
            post={true}
            put={false}
            resumeId={resumeId}
            setLanguages={setLanguages}
            closeAddModal={closeAddModal}
          />
        </Modal>
      </div>
    </div>
  );
}

export default Language;
