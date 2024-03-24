import React, { useState, useContext, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import swal from "sweetalert2";
import { Label } from "@/components/ui/label";
import { Input, Button } from "antd";
import { Mail, Phone } from "lucide-react";
import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import "@/components/styling/button.css";
import PasswordChangeSection from "@/components/Profile/PasswordChangeSection";

import { handleErrorAndShowMessageAutomatically } from "@/components/error_handler/error_display";
import ProfileDetails from "@/components/Profile/ProfileDetails";

const EmployerProfile = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    other_names: user?.other_names || "",
    phone_number: user?.phone_number || "",
    company: user?.company || "",
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    const fetchEmployerData = async () => {
      if (user?.user_id) {
        try {
          const response = await AxiosInstance.get(
            `/api/employers/${user?.user_id}/`
          );

          if (response.status === 200) {
            const {
              email,
              first_name,
              last_name,
              other_names,
              phone_number,
              company,
            } = response.data;
            setFormData((prevFormData) => ({
              ...prevFormData,
              email,
              first_name,
              last_name,
              other_names,
              phone_number,
              company: company || null,
            }));
          } else {
            swal.fire(
              "Failed to fetch",
              "Could not fetch employer profile.",
              "error"
            );
          }
        } catch (error) {
          console.log(error);
          swal.fire(
            "Error",
            "An error occurred while fetching the employer profile.",
            "error"
          );
          handleErrorAndShowMessageAutomatically(error);
        }
      }
    };

    fetchEmployerData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.user_id) {
      try {
        const response = await AxiosInstance.put(
          `/api/employers/${user?.user_id}/update/`,
          formData
        );

        if (response.status === 200) {
          swal.fire(
            "Profile Updated",
            "Your profile has been updated successfully.",
            "success"
          );
        } 
      } catch (error) {
        swal.fire("Update Failed", error.message, "error");
        handleErrorAndShowMessageAutomatically(error);
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosInstance.put(
        "/api/employer/change-password/",
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmNewPassword,
        }
      );

      if (response.status === 200) {
        swal.fire({
          title: "Password Changed Successfully",
          icon: "success",
          toast: true,
          timer: 6000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      handleErrorAndShowMessageAutomatically(error);
    }
  };

  return (
    <div>   
      <ProfileDetails
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        userType="employer"
      />
      <PasswordChangeSection
        oldPassword={oldPassword}
        setOldPassword={setOldPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmNewPassword={confirmNewPassword}
        setConfirmNewPassword={setConfirmNewPassword}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
};

export default EmployerProfile;
