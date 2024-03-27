import React, { useContext, useState } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input, InputNumber, Select, Modal, Button } from "antd";
import Swal from "sweetalert2";
import QuestionCreationPage from "./QuestionCreationPage";
import "@/components/styling/button.css";

const { TextArea } = Input;

function JobCreationPage() {
  const { user } = useContext(AuthContext);
  const userId = user.user_id;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [jobId, setJobId] = useState(null);

  const showAddModal = () => {
    setIsAddModalOpen(true);
  };

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

  const showJobCreatedError = () => {
    Swal.fire("Error", "There was an error creating the job.", "error");
  };

  const handleJobCreation = async (event) => {
    event.preventDefault();
    try {
      const jobResponse = await AxiosInstance.post("api/jobs/create-job", {
        title: formData.title,
        description: formData.description,
        salary: formData.salary,
        address: addressData,
        job_type: formData.job_type,
      });

      await AxiosInstance.post("api/employer-job-relations/create/", {
        employer: userId,
        job: jobResponse.data.id,
      });

      setJobId(jobResponse.data.id);
      showAddModal();
    } catch (error) {
      showJobCreatedError();
      console.log(error);
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
    <div className="flex justify-center items-center w-full">
      <Card className="w-1/2 px-12 py-6">
        <CardHeader className="flex justify-center items-center mt-4">
          <CardTitle className="text-2xl font-bold">Create a Job Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJobCreation} className="space-y-4">
            <div>
              <Label className="text-lg font-semibold">Job Title</Label>
              <Input
                className="w-full mt-2 border-gray-300 rounded-md"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label className="text-lg font-semibold">Job Description</Label>
              <TextArea
                className="w-full mt-2 border-gray-300 rounded-md"
                type="text"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label className="text-lg font-semibold">Salary</Label>
              <InputNumber
                className="w-full mt-2 border-gray-300 rounded-md"
                name="salary"
                formatter={(value) => `£ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/\£\s?|(,*)/g, "")}
                defaultValue={formData.salary}
                onChange={(value) => setFormData({ ...formData, salary: value })}
              />
            </div>
            <div className="flex space-x-4">
              <div>
                <Label className="text-lg font-semibold">Postcode</Label>
                <Input
                  className="w-full mt-2 border-gray-300 rounded-md"
                  type="text"
                  name="post_code"
                  value={addressData.post_code}
                  onChange={handleAddressChange}
                />
              </div>
              <div>
                <Label className="text-lg font-semibold">City</Label>
                <Input
                  className="w-full mt-2 border-gray-300 rounded-md"
                  type="text"
                  name="city"
                  value={addressData.city}
                  onChange={handleAddressChange}
                />
              </div>
              <div>
                <Label className="text-lg font-semibold">Country</Label>
                <Input
                  className="w-full mt-2 border-gray-300 rounded-md"
                  type="text"
                  name="country"
                  value={addressData.country}
                  onChange={handleAddressChange}
                />
              </div>
            </div>
            <div>
              <Label className="text-lg font-semibold">Job Type</Label>
              <Select
                data-testid="job_type"
                className="w-full mt-2 border-gray-300 rounded-md"
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
              <Button type="submit" className="blueButton w-full" variant="outline">
                Create Job
              </Button>
            </div>
          </form>
          <Modal title="Create Questions" open={isAddModalOpen} footer={null} closeIcon={null}>
            <QuestionCreationPage jobId={jobId}></QuestionCreationPage>
          </Modal>
        </CardContent>
      </Card>
    </div>
  );
}
export default JobCreationPage;
