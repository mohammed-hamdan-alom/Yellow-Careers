import React, { useState, useContext, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import swal from "sweetalert2";
import "@/components/styling/button.css";
import PasswordChangeSection from "@/components/Profile/PasswordChangeSection";
import { handleErrorAndShowMessage } from "@/components/handleErrorAndShowMessage/handleErrorAndShowMessage";
import ProfileDetails from "@/components/Profile/ProfileDetails";
import "@/components/styling/button.css";

const JobSeekerProfile = () => {
  const { user } = useContext(AuthContext);

  const [errors, setErrors] = useState({
    email: "",
    first_name: "",
    last_name: "",
    other_names: "",
    phone_number: "",
    dob: "",
    nationality: "",
    sex: "",
    address: {
      city: "",
      post_code: "",
      country: "",
    },
  });

  const [formData, setFormData] = useState({
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    other_names: user.other_names,
    phone_number: user.phone_number,
    dob: user.dob,
    nationality: user.nationality,
    sex: user.sex,
    address: {
      city: user.city,
      post_code: user.postcode,
      country: user.country,
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
          handleErrorAndShowMessage("Error retrieving data:", error);
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
    } else if (name === "sex") {
      const sexValue = value === "Male" ? "M" : "F";
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: sexValue,
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
        setErrors(error.response.data);
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
      handleErrorAndShowMessage("Error changing password:", error);
    }
  };

  return (
    <div className='mb-2'>
      <ProfileDetails
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        errors={errors}
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