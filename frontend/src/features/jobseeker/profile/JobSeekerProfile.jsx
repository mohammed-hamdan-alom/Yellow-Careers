import React, { useState, useContext, useEffect } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import swal from "sweetalert2";
import { UserOutlined } from '@ant-design/icons';
import { Label } from "@/components/ui/label";
import { Input,Select, Button } from "antd";
const { Option } = Select;
import { Mail, Phone, Calendar, Earth, MapPin   } from 'lucide-react';
import '@/components/styling/button.css';


const JobSeekerProfile = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
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
    }
    else {
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
  }



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
        } else {
          swal.fire("Update Failed", `Error: ${response.status}`, "error");
        }
      } catch (error) {
        swal.fire("Update Failed", error.message, "error");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
        <div className="mb-3">
        <Label htmlFor="email" className="text-lg mr-2">
          Email:
        </Label>
        <Input prefix={<Mail size={16} />} disabled  value={user?.email} />
      </div>

      <div className="mb-3">
        <Label htmlFor="first_name" >First Name: </Label>
        <Input type="text" prefix = {<UserOutlined className="site-form-item-icon" /> } id="first_name" name="first_name" value={formData.first_name} onChange={(e) => handleChange(e, 'first_name')} />
      </div> 
      <div className="mb-3">
        <Label htmlFor="last_name">Last Name: </Label>
        <Input type="text" prefix = {<UserOutlined className="site-form-item-icon"  /> } id="last_name" name="last_name" value={formData.last_name} onChange={(e) => handleChange(e, 'last_name')} />
      </div>
      <div className="mb-3">
        <Label htmlFor="other_names">Other Names: </Label>
        <Input type="text" prefix = {<UserOutlined className="site-form-item-icon" /> } id="other_names" name="other_names" value={formData.other_names} onChange={(e) => handleChange(e, 'other_names')} />
      </div>
      <div className="mb-3">
        <Label htmlFor="phone_number">Phone Number: </Label>
        <Input type="text" prefix = {<Phone size={15}/>} id="phone_number" name="phone_number" value={formData.phone_number} onChange={(e) => handleChange(e, 'phone_number')} />
      </div>
      <div className="mb-3">
        <Label htmlFor="dob">Date of Birth: </Label>
        <Input type="date" prefix = {<Calendar size={15}/>} id="dob" name="dob" value={formData.dob} onChange={(e) => handleChange(e, 'dob')} />
      </div>
      <div className="mb-3">
        <Label htmlFor="nationality">Nationality: </Label>
        <Input type="text" prefix = {<Earth size={15}/>} id="nationality" name="nationality" value={formData.nationality} onChange={(e) => handleChange(e, 'nationality')} />
      </div>
      <div className="mb-3">
        <Label htmlFor="sex">Sex: </Label>
        <br/>
        <Select id="sex" name="sex" value={formData.sex} onChange={(e) => handleSexChange(e, 'sex')}>
          <Option value="M">Male</Option>
          <Option value="F">Female</Option>
        </Select>
      </div>
      <div className="mb-3">
        <Label htmlFor="city">City: </Label>
        <Input type="text" prefix = {<MapPin size={15}/>} id="city" name="city" value={formData.address.city} onChange={(e) => handleChange(e, 'city')} />
      </div>
      <div className="mb-3">
        <Label htmlFor="post_code">Post Code: </Label>
        <Input type="text" prefix = {<MapPin size={15}/>} id="post_code" name="post_code" value={formData.address.post_code} onChange={(e) => handleChange(e, 'post_code')} />
      </div>
      <div className="mb-3">
        <Label htmlFor="country">Country: </Label>
        <Input type="text" prefix = {<MapPin size={15}/>} id="country" name="country" value={formData.address.country} onChange={(e) => handleChange(e, 'country')} />
      </div>
      <div style={{ marginTop: '25px' }}>
          <Button className="yellowButton" type="submit" onClick={handleSubmit} >Update Profile</Button>
      </div>
    </form>
  );
};

export default JobSeekerProfile;
