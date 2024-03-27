import React from "react";
import { Input, Select, Button } from "antd";
import { Mail, Phone, Calendar, MapPin } from "lucide-react";
import { UserOutlined } from "@ant-design/icons";
import { Label } from "@/components/ui/label";
import { nationalityOptions } from "@/components/Nationalities/nationalityOptions";
import BigAlert from "../Alert/BigAlert";
import moment from "moment";

const { Option } = Select;

const ProfileDetails = ({ formData, handleChange, handleSubmit, userType, errors }) => {
  console.log(errors);
  return (
    <div className="flex flex-col space-y-6">
      <div className="mb-3">
        <Label htmlFor="email" className="text-lg mr-2">
          Email:
        </Label>
        <Input id="email" prefix={<Mail size={16} />} disabled value={formData.email} />
      </div>
      <div className="mb-3 space-y-2">
        <Label htmlFor="first_name">First Name: </Label>
        <Input
          type="text"
          prefix={<UserOutlined className="site-form-item-icon" />}
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={(e) => handleChange(e)}
        />
        {errors.first_name && <BigAlert message={errors.first_name} type="error" />}
      </div>
      <div className="mb-3 space-y-2">
        <Label htmlFor="last_name">Last Name: </Label>
        <Input
          type="text"
          prefix={<UserOutlined className="site-form-item-icon" />}
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={(e) => handleChange(e)}
        />
        {errors.last_name && <BigAlert message={errors.last_name} type="error" />}
      </div>
      <div className="mb-3 space-y-2">
        <Label htmlFor="other_names">Other Names: </Label>
        <Input
          type="text"
          prefix={<UserOutlined className="site-form-item-icon" />}
          id="other_names"
          name="other_names"
          value={formData.other_names}
          onChange={(e) => handleChange(e)}
        />
        {errors.other_names && <BigAlert message={errors.other_names} type="error" />}
      </div>
      <div className="mb-3 space-y-2">
        <Label htmlFor="phone_number">Phone Number: </Label>
        <Input
          type="text"
          prefix={<Phone size={15} />}
          id="phone_number"
          name="phone_number"
          value={formData.phone_number}
          onChange={(e) => handleChange(e)}
        />
        {errors.phone_number && <BigAlert message={errors.phone_number} type="error" />}
      </div>

      {userType === "job-seeker" && (
        <>
          <div className="mb-3 space-y-2">
            <Label htmlFor="dob">Date of Birth: </Label>
            <Input
              type="date"
              prefix={<Calendar size={15} />}
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={(e) => handleChange(e)}
              max={moment().format("YYYY-MM-DD")}
            />
            {errors.dob && <BigAlert message={errors.dob} type="error" />}
          </div>
          <div className="mb-3 flex flex-col space-y-2">
            <Label htmlFor="nationality">Nationality: </Label>
            <Select
              showSearch
              className="w-full"
              name="nationality"
              id="nationality"
              value={formData.nationality}
              onChange={(value) => handleChange({ target: { name: "nationality", value } })}
            >
              {nationalityOptions.map((option, index) => (
                <Option key={index} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
            {errors.nationality && <BigAlert message={errors.nationality} type="error" />}
          </div>
          <div className="mb-3 space-y-2">
            <Label htmlFor="sex">Sex: </Label>
            <Select
              id="sex"
              className="w-full"
              name="sex"
              value={formData.sex}
              onChange={(value) => handleChange({ target: { name: "sex", value } })}
            >
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
            {errors.sex && <BigAlert message={errors.sex} type="error" />}
          </div>
          <div className="mb-3 space-y-2">
            <Label htmlFor="city">City: </Label>
            <Input
              type="text"
              prefix={<MapPin size={15} />}
              id="city"
              name="city"
              value={formData.address.city}
              onChange={(e) => handleChange(e)}
            />
            {errors
              ? errors.address.city && <BigAlert message={errors.address.city} type="error" />
              : null}
          </div>
          <div className="mb-3 space-y-2">
            <Label htmlFor="post_code">Post Code: </Label>
            <Input
              type="text"
              prefix={<MapPin size={15} />}
              id="post_code"
              name="post_code"
              value={formData.address.post_code}
              onChange={(e) => handleChange(e)}
            />
            {errors
              ? errors.address.post_code && (
                  <BigAlert message={errors.address.post_code} type="error" />
                )
              : null}
          </div>
          <div className="mb-3 space-y-2">
            <Label htmlFor="country">Country: </Label>
            <Input
              type="text"
              prefix={<MapPin size={15} />}
              id="country"
              name="country"
              value={formData.address.country}
              onChange={(e) => handleChange(e)}
            />
            {errors
              ? errors.address.country && <BigAlert message={errors.address.country} type="error" />
              : null}
          </div>
        </>
      )}

      <div style={{ marginTop: "25px" }}>
        <Button className="yellowButton" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default ProfileDetails;
