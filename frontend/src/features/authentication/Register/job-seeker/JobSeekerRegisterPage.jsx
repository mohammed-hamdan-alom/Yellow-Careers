import React, { useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "antd";
import { DatePicker } from "antd";
import { Button } from "@/components/ui/button";
import { nationalityOptions } from "@/components/Nationalities/nationalityOptions";

const JobSeekerRegisterPage = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
    password2: "",
    firstName: "",
    lastName: "",
    otherNames: "",
    dob: "",
    phoneNumber: "",
    nationality: "",
    sex: "",
  });

  const nationalityOptionsWithLabel = () => {
    let options = [];
    nationalityOptions.forEach((option) => {
      options.push({ label: option, value: option.toLowerCase() });
    });
    return options;
  };

  const { registerJobSeeker } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    registerJobSeeker(user);
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date, dateString) => {
    setUser({
      ...user,
      dob: dateString,
    });
  };

  const handleNationalityChange = (value) => {
    if (value) {
      setUser({
        ...user,
        nationality: value,
      });
    }
  };

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <div className="h-screen flex items-center justify-center">
        <Card>
          <CardHeader className="flex items-center mt-4">
            <CardTitle>Register as a Job Seeker</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="mt-4">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" name="email" onChange={handleChange} />
              </div>
              <div className="flex space-x-4">
                <div className="mt-4">
                  <Label htmlFor="password">Password</Label>
                  <Input type="password" id="password" name="password" onChange={handleChange} />
                </div>
                <div className="mt-4">
                  <Label htmlFor="password2">Confirm Password</Label>
                  <Input type="password" id="password2" name="password2" onChange={handleChange} />
                </div>
              </div>
              <div className="flex space-x-4 mt-4">
                <div className="w-1/2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input type="text" id="firstName" name="firstName" onChange={handleChange} />
                </div>
                <div className="w-1/2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input type="text" id="lastName" name="lastName" onChange={handleChange} />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="otherNames">Other Names</Label>
                <Input type="text" id="otherNames" name="otherNames" onChange={handleChange} />
              </div>
              <div className="mt-4">
                <Label htmlFor="dob">Date of Birth</Label>
                <div className="mt-2">
                  <DatePicker id="dob" className="w-full" onChange={handleDateChange} />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input type="text" id="phoneNumber" name="phoneNumber" onChange={handleChange} />
              </div>
              <div className="mt-4">
                <Label htmlFor="nationality">Nationality</Label>
                <div className="mt-2">
                  <Select
                    showSearch
                    id="nationality"
                    data-testid="nationality"
                    className="w-full bg-background"
                    placeholder="Select a Nationality"
                    optionFilterProp="children"
                    onChange={handleNationalityChange}
                    filterOption={filterOption}
                    options={nationalityOptionsWithLabel()}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="sex">Gender</Label>
                <RadioGroup
                  onChange={(e) => {
                    setUser({ ...user, sex: e.target.value });
                  }}
                  id="sex"
                  data-testid="gender-input"
                >
                  <div className="flex space-x-4 mt-2">
                    <div className="flex flex-row space-x-2">
                      <RadioGroupItem value="M" id="male" name="sex" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex flex-row space-x-2">
                      <RadioGroupItem value="F" id="female" name="sex" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              <div className="mt-4">
                <Button type="submit" className="w-full mt-4" data-testid="register-button">
                  Register
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default JobSeekerRegisterPage;
