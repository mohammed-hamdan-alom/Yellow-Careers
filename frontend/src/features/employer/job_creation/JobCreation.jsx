import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input, InputNumber } from "antd";
import { Select } from "antd";
import { Button } from "@/components/ui/button";
const { TextArea } = Input;
import { showJobCreatedError, showJobCreatedSuccess } from '@/components/Alert/Alert';

function JobCreationForm() {
  const { user } = useContext(AuthContext);
  const userId = user.user_id;

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: 0,
    address: null,
    job_type: "FT",
  });

  const [addressData, setAddressData] = useState({
    city: "",
    post_code: "",
    country: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (addressData.city && addressData.country && addressData.post_code) {
      AxiosInstance.post('api/addresses/create/', {
        city: addressData.city,
        country: addressData.country,
        post_code: addressData.post_code
      }).then((response) => {
        AxiosInstance.post('api/jobs/create-job', {
          title: formData.title,
          description: formData.description,
          salary: formData.salary,
          address: response.data.id,
          job_type: formData.job_type
        }).then((response) => {
          AxiosInstance.post('api/employer-job-relations/create/', {
            employer: userId,
            job: response.data.id
          });
          showJobCreatedSuccess();
          navigate(`/employer/create-questions/${response.data.id}`);
        }).catch((error) => {
          showJobCreatedError();
          console.log(error);
        });
      });
    }
    else {
      AxiosInstance.post('api/jobs/create-job', {
        title: formData.title,
        description: formData.description,
        salary: formData.salary,
        address: formData.address,
        job_type: formData.job_type
      }).then((response) => {
        AxiosInstance.post('api/employer-job-relations/create/', {
          employer: userId,
          job: response.data.id
        });
        showJobCreatedSuccess();
        navigate(`/employer/create-questions/${response.data.id}`);
      }).catch((error) => {
        showJobCreatedError();
        console.log(error);
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setAddressData({
      ...addressData,
      [name]: value,
    });
  };

  return (
    <div className="w-full flex justify-center items-center">
      <Card className="w-1/2 px-12 py-6">
        <CardHeader className="justify-center items-center mt-4">
          <CardTitle>Create a Job Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-4">
              <Label className="text-2xl">Job Title</Label>
              <Input
                className="w-full mt-2"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col mb-4">
              <Label className="text-2xl">Job Description</Label>
              <TextArea
                className="w-full mt-2"
                type="text"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col mb-4">
              <Label className="text-2xl">Salary</Label>
              <InputNumber
                className="w-full mt-2"
                formatter={(value) =>
                  `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\£\s?|(,*)/g, "")}
                defaultValue={formData.salary}
                onChange={(value) =>
                  setFormData({ ...formData, salary: value })
                }
              />
            </div>
            <div className="flex flex-row justify-between mb-4 space-x-4">
              <div className="flex flex-col mb-4 ">
                <Label className="text-2xl">Postcode</Label>
                <Input
                  className="w-full mt-2"
                  type="text"
                  name="post_code"
                  value={addressData.post_code}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="flex flex-col mb-4">
                <Label className="text-2xl">City</Label>
                <Input
                  className="w-full mt-2"
                  type="text"
                  name="city"
                  value={addressData.city}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="flex flex-col mb-4">
                <Label className="text-2xl">Country</Label>
                <Input
                  className="w-full mt-2"
                  type="text"
                  name="country"
                  value={addressData.country}
                  onChange={handleAddressChange}
                />
              </div>
            </div>

            <div className="flex flex-col mb-4">
              <Label className="text-2xl">Job Type</Label>
              <Select
                className="w-full mt-2"
                name="job_type"
                value={formData.job_type}
                onChange={(value) => setFormData({ ...formData, job_type: value })}
              >
                <Select.Option value="FT">Full Time</Select.Option>
                <Select.Option value="PT">Part Time</Select.Option>
                <Select.Option value="IN">Internship</Select.Option>
                <Select.Option value="TM">Temporary</Select.Option>
              </Select>
            </div>
            <div className="mt-12 w-full">
              <Button type="submit" className="w-full" variant="outline" >
                Create Job
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default JobCreationForm;
