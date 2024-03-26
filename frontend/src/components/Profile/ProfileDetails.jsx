import React from "react";
import { Input, Select, Button } from "antd";
import { Mail, Phone, Calendar, MapPin } from "lucide-react";
import { UserOutlined } from "@ant-design/icons";
import { Label } from "@/components/ui/label";
import { nationalityOptions } from "@/components/Nationalities/nationalityOptions";
import moment from "moment";

const { Option } = Select;

const ProfileDetails = ({ formData, handleChange, handleSubmit, userType }) => {
  return (
    <div>
      <div className="mb-3">
        <Label htmlFor="email" className="text-lg mr-2">
          Email:
        </Label>
        <Input id="email" prefix={<Mail size={16} />} disabled value={formData.email} />
      </div>
      <div className="mb-3">
        <Label htmlFor="first_name">First Name: </Label>
        <Input
          type="text"
          prefix={<UserOutlined className="site-form-item-icon" />}
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={(e) => handleChange(e)}
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
          onChange={(e) => handleChange(e)}
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
          onChange={(e) => handleChange(e)}
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
          onChange={(e) => handleChange(e)}
        />
      </div>

      {userType === "job-seeker" && (
        <>
          <div className="mb-3">
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
          </div>
          <div className="mb-3">
            <Label htmlFor="nationality">Nationality: </Label>
            <Select
              showSearch
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
          </div>
          <div className="mb-3">
            <Label htmlFor="sex">Sex: </Label>
            <br />
            <Select
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={(value) => handleChange({ target: { name: "sex", value } })}
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
              onChange={(e) => handleChange(e)}
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
              onChange={(e) => handleChange(e)}
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
              onChange={(e) => handleChange(e)}
            />
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
