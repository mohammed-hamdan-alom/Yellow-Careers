import React, { useState, useContext, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import swal from "sweetalert2";
import { nationalityOptions } from "@/components/Nationalities/nationalityOptions";
import { UserOutlined } from "@ant-design/icons";
import { Label } from "@/components/ui/label";
import { Input, Select, Button } from "antd";
const { Option } = Select;
import { Mail, Phone, Calendar, MapPin } from "lucide-react";
import "@/components/styling/button.css";
import PasswordChangeSection from "@/components/Profile/PasswordChangeSection";
import { handleErrorAndShowMessageAutomatically } from "@/components/error_handler/error_display";
import ProfileDetails from "@/components/Profile/ProfileDetails";

const JobSeekerProfile = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    other_names: user?.other_names || "",
    phone_number: user?.phone_number || "",
    dob: user?.dob || "",
    nationality: user?.nationality || "",
    sex: user?.sex || "",
    address: {
      city: user?.address?.city || "",
      post_code: user?.address?.post_code || "",
      country: user?.address?.country || "",
    },
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");


  useEffect(() => {
    const fetchJobSeekerData = async () => {
      if (user?.user_id) {
        try {
          const response = await AxiosInstance.get(
            `/api/job-seekers/${user?.user_id}/`
          );
          if (response.status === 200) {
            const {
              email,
              first_name,
              last_name,
              other_names,
              phone_number,
              dob,
              nationality,
              sex,
              address,
            } = response.data;
            setFormData({
              email,
              first_name,
              last_name,
              other_names,
              phone_number,
              dob,
              nationality,
              sex,
              address: {
                city: address?.city || "",
                post_code: address?.post_code || "",
                country: address?.country || "",
              },
            });
          } else {
            swal.fire(
              "Failed to fetch",
              "Could not fetch job seeker profile.",
              "error"
            );
          }
        } catch (error) {
          swal.fire(
            "Error",
            "An error occurred while fetching the profile.",
            "error"
          );
          handleErrorAndShowMessageAutomatically(error);
        }
      }
    };

    fetchJobSeekerData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["city", "post_code", "country"].includes(name)) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.user_id) {
      try {
        const response = await AxiosInstance.put(
          `/api/job-seekers/${user?.user_id}/update/`,
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
        "/api/job-seeker/change-password/",
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
        userType="job-seeker"
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

export default JobSeekerProfile;
