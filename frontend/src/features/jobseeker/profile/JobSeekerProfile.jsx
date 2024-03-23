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
import moment from "moment";

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

  // const [passwordFormData, setPasswordFormData] = useState({
  //   oldPassword: "",
  //   newPassword: "",
  //   confirmNewPassword: "",
  // });
  const { changePassword } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);

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

  const handleSexChange = (value, name) => {
    if (name === "sex") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleNationalityChange = (value, name) => {
    if (name === "nationality") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };
  
  const isValidDOB = (dob) => {
    const currentDate = new Date();
    const selectedDate = new Date(dob);
    return selectedDate <= currentDate;
  };

  const handleDOBChange = (value, name) => {
    if (isValidDOB(value)) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.user_id) {
      const phoneNumberInput = document.getElementById("phone_number");
      if (phoneNumberInput.checkValidity()) {
        setIsValidPhoneNumber(true);  
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
          } else {
            swal.fire("Update Failed", `Error: ${response.status}`, "error");
          }
        } catch (error) {
          swal.fire("Update Failed", error.message, "error");
        }
      } else {
        setIsValidPhoneNumber(false);
      }
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (!newPassword) {
        alert("New password is required.");
        return;
      }
      await changePassword(oldPassword, newPassword);
    } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.old_password
        ) {
          // Backend indicates that the old password is incorrect
          const errorMessage = error.response.data.old_password[0];
          console.error("Old password is incorrect:", errorMessage);
        } else {
          console.error("Error changing password:", error);
        }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="container mt-5">
        <div className="mb-3">
          <Label htmlFor="email" className="text-lg mr-2">
            Email:
          </Label>
          <Input
            id="email"
            prefix={<Mail size={16} />}
            disabled
            value={user?.email}
          />
        </div>
        <div className="mb-3">
          <Label htmlFor="first_name">First Name: </Label>
          <Input
            type="text"
            prefix={<UserOutlined className="site-form-item-icon" />}
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={(e) => handleChange(e, "first_name")}
          />
        </div>
        <div className="mb-3">
          <Label htmlFor="last_name">Last Name: </Label>
          <Input
            type="text"
            prefix={<UserOutlined className="site-form-item-icon" />}
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={(e) => handleChange(e, "last_name")}
          />
        </div>
        <div className="mb-3">
          <Label htmlFor="other_names">Other Names: </Label>
          <Input
            type="text"
            prefix={<UserOutlined className="site-form-item-icon" />}
            id="other_names"
            name="other_names"
            value={formData.other_names}
            onChange={(e) => handleChange(e, "other_names")}
          />
        </div>
        <div className="mb-3">
          <Label htmlFor="phone_number">Phone Number: </Label>
          <Input
            type="text"
            prefix={<Phone size={15} />}
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={(e) => handleChange(e, "phone_number")}
          />
        </div>
        <div className="mb-3">
          <Label htmlFor="dob">Date of Birth: </Label>
          <Input
            type="date"
            prefix={<Calendar size={15} />}
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={(e) => handleDOBChange(e.target.value, "dob")}
            max={moment().format("YYYY-MM-DD")}
          />
        </div>
        <div className="mb-3">
          <Label htmlFor="nationality">Nationality: </Label>
          <Select
            showSearch
            name="nationality"
            id="nationality"
            value={formData.nationality}
            onChange={(e) => handleNationalityChange(e, "nationality")}
          >
            {nationalityOptions.map((option, index) => (
              <Option key={index} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </div>
        <div className="mb-3">
          <Label htmlFor="sex">Sex: </Label>
          <br />
          <Select
            id="sex"
            name="sex"
            value={formData.sex}
            onChange={(e) => handleSexChange(e, "sex")}
          >
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
          </Select>
        </div>
        <div className="mb-3">
          <Label htmlFor="city">City: </Label>
          <Input
            type="text"
            prefix={<MapPin size={15} />}
            id="city"
            name="city"
            value={formData.address.city}
            onChange={(e) => handleChange(e, "city")}
          />
        </div>
        <div className="mb-3">
          <Label htmlFor="post_code">Post Code: </Label>
          <Input
            type="text"
            prefix={<MapPin size={15} />}
            id="post_code"
            name="post_code"
            value={formData.address.post_code}
            onChange={(e) => handleChange(e, "post_code")}
          />
        </div>
        <div className="mb-3">
          <Label htmlFor="country">Country: </Label>
          <Input
            type="text"
            prefix={<MapPin size={15} />}
            id="country"
            name="country"
            value={formData.address.country}
            onChange={(e) => handleChange(e, "country")}
          />
        </div>
        <div style={{ marginTop: "25px" }}>
          <Button className="yellowButton" type="submit" onClick={handleSubmit}>
            Update Profile
          </Button>
        </div>
      </form>


      <div>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Old Password"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
        />
        <input
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          placeholder="Confirm New Password"
        />
        <button onClick={handlePasswordChange}>Change Password</button>
      </div>
    </div>
  );
};

export default JobSeekerProfile;
