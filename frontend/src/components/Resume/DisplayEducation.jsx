import React, { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { Label } from "@/components/ui/label";
import { GraduationCap, MapPin } from "lucide-react";
import { Tag } from "antd";
import "../styling/tag.css";
import "../styling/shadow.css";

function DisplayEducation({ resumeId }) {
  const [educations, setEducations] = useState([]);

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

  return (
    <div className="bg-white shadow-blue rounded-md p-6 mt-6">
      <h3 className="text-lg font-semibold mb-2">
        <Tag className="tag-large" color="blue">
          Education
        </Tag>
      </h3>
      {educations.map((education, index) => (
        <div key={index} className="mb-6">
          <div className="flex items-center mb-2">
            <GraduationCap className="mr-2 text-gray-700" size={20} />
            <Label className="text-xl font-semibold">{education.course_name}</Label>
          </div>
          <p className="mb-2">
            <span className="font-semibold">Start Date:</span> {education.start_date}
          </p>
          <p className="mb-2">
            <span className="font-semibold">End Date:</span> {education.end_date}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Level:</span> {education.level}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Institution:</span> {education.institution}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Grade:</span> {education.grade}
          </p>
          {education.address && (
            <div className="flex items-center">
              <MapPin className="mr-2 text-gray-700" size={20} />
              <Label>
                <strong>Location:</strong> {education.address.post_code}, {education.address.city},{" "}
                {education.address.country}
              </Label>
            </div>
          )}
          {/* Add divider if it's not the last education item */}
          {index < educations.length - 1 && <hr className="my-4 border-gray-300" />}
        </div>
      ))}
    </div>
  );
}

export default DisplayEducation;
