import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { Label } from "@/components/ui/label";
import { Briefcase, MapPin } from "lucide-react";
import { Tag } from "antd";
import "../styling/tag.css";
import "../styling/shadow.css";

function DisplayProfessionalExperience({ resumeId }) {
  const [professionalExperiences, setProfessionalExperiences] = useState([]);

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

  return (
    <div className="bg-white shadow-purple rounded-md p-6 mt-6">
      <h3 className="text-lg font-semibold mb-2">
        <Tag className="tag-large" color="purple">
          Professional Experience
        </Tag>
      </h3>
      {professionalExperiences.map((professionalExperience, index) => (
        <div key={index} className="mb-6">
          <div className="flex items-center mb-2">
            <Briefcase className="mr-2 text-gray-700" size={20} />
            <Label className="text-xl font-semibold">
              {professionalExperience.position}
            </Label>
          </div>
          <p className="mb-2">
            <span className="font-semibold">Start Date:</span>{" "}
            {professionalExperience.start_date}
          </p>
          <p className="mb-2">
            <span className="font-semibold">End Date:</span>{" "}
            {professionalExperience.end_date}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Company:</span>{" "}
            {professionalExperience.company}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Position:</span>{" "}
            {professionalExperience.position}
          </p>
          {professionalExperience.address && (
            <div className="flex items-center">
              <MapPin className="mr-2 text-gray-700" size={20} />
              <Label>
                <strong>Location:</strong>{" "}
                {professionalExperience.address.post_code},{" "}
                {professionalExperience.address.city},{" "}
                {professionalExperience.address.country}
              </Label>
            </div>
          )}
          {/* Add divider if it's not the last experience item */}
          {index < professionalExperiences.length - 1 && (
            <hr className="my-4 border-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
}

export default DisplayProfessionalExperience;
