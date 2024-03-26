import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from "@/components/Alert/Alert";
import EditLanguagePage from "./EditLanguagePage";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SquarePen, MinusCircle } from "lucide-react";
import { Modal } from "antd";

function Language({ resumeId }) {
  const [languages, setLanguages] = useState([]);
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
    const fetchLanguages = async () => {
      if (!resumeId) {
        return;
      }
      try {
        const response = await AxiosInstance.get(`api/resumes/${resumeId}/languages/`);
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
      await AxiosInstance.delete(`api/resumes/${resumeId}/languages/update/${languageObj.id}`);
      showSuccess("Language Deleted");
      setLanguages((prevLanguages) => prevLanguages.filter((item) => item !== languageObj));
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
          <div key={language.id} className="flex flex-row items-center justify-between mb-4">
            <div>
              <Label className="text-1xl">{language.language}</Label>
            </div>
            <div className="flex flex-row items-center">
              <Button className="mr-4" variant="secondary" size="icon" onClick={showEditModal}>
                <SquarePen className="w-5 h-5" />
              </Button>
              <Button
                data-testid="delete-button"
                className=""
                variant="destructive"
                size="icon"
                onClick={() => handleDeleteLanguage(language)}
              >
                <MinusCircle />
              </Button>
              <Modal
                title="Edit Language"
                footer={null}
                open={isEditModalOpen}
                onOk={() => setIsEditModalOpen(false)}
                onClose={() => setIsEditModalOpen(false)}
              >
                <EditLanguagePage
                  post={false}
                  put={true}
                  resumeId={resumeId}
                  languageId={language.id}
                  setLanguages={setLanguages}
                  closeEditModal={closeEditModal}
                />
              </Modal>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Button variant="outline" onClick={showAddModal}>
          Add Language
        </Button>
        <Modal
          title="Add Language"
          open={isAddModalOpen}
          footer={null}
          onOk={() => setIsAddModalOpen(false)}
          onClose={() => setIsAddModalOpen(false)}
        >
          <EditLanguagePage
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
