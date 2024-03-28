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
import BigAlert from "@/components/Alert/BigAlert";


const JobSeekerRegister = () => {
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
  const [errors, setErrors] = useState("");

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
    try {
      await registerJobSeeker(user);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
    }
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
    <div className="flex items-center justify-center h-screen">
      <Card className="w-2/5 max-h-screen overflow-y-auto">
        <CardHeader className="flex items-center mt-4">
          <CardTitle>Register as a Job Seeker</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-2 mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
              />
              {errors.email && (
                <BigAlert message={errors.email} />
              )}
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="w-1/2 space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleChange}
                />
                {errors.password && (
                  <BigAlert message={errors.password} />
                )}
              </div>
              <div className="w-1/2 space-y-2">
                <Label htmlFor="password2">Confirm Password</Label>
                <Input
                  type="password"
                  id="password2"
                  name="password2"
                  onChange={handleChange}
                />
                {errors.password2 && (
                  <BigAlert message={errors.password2} />
                )}
              </div>
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="w-1/2 space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  onChange={handleChange}
                />
                {errors.first_name && (
                  <BigAlert message={errors.first_name} />
                )}
              </div>
              <div className="w-1/2 space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  onChange={handleChange}
                />
                {errors.last_name && (
                  <BigAlert message={errors.last_name} />
                )}
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <Label htmlFor="otherNames">Other Names</Label>
              <Input
                type="text"
                id="otherNames"
                name="otherNames"
                onChange={handleChange}
              />
              {errors.other_names && (
                <BigAlert message={errors.other_names} />
              )}
            </div>
            <div className="mb-4 space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <DatePicker
                id="dob"
                className="w-full"
                onChange={handleDateChange}
              />
              {errors.dob && <BigAlert message={errors.dob} />}
            </div>
            <div className="space-y-2 mb-4">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                onChange={handleChange}
              />
              {errors.phone_number && (
                <BigAlert message={errors.phone_number} />
              )}
            </div>
            <div className="space-y-2 mb-4">
              <Label htmlFor="nationality">Nationality</Label>
              <Select
                showSearch
                data-testid="nationality"
                id="nationality"
                className="w-full bg-background"
                placeholder="Select a Nationality"
                optionFilterProp="children"
                onChange={handleNationalityChange}
                filterOption={filterOption}
                options={nationalityOptionsWithLabel()}
              />
              {errors.nationality && (
                <BigAlert message={errors.nationality} />
              )}
            </div>
            <div className="space-y-2">
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
              {errors.sex && (
                <BigAlert message="Please pick a choice" />
              )}
            </div>
            <div className="mt-4">
              <Button
                type="submit"
                className="w-full mt-4"
                data-testid="register-button"
              >
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobSeekerRegister;