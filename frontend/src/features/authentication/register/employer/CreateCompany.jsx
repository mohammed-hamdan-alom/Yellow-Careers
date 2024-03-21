import React from "react";
import { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "@/components/Alert/Alert"

const CreateCompany = () => {
  const [company, setCompany] = useState({
    company_name: "",
    website: "",
    about: "",
  });
  const [adminEmail, setAdminEmail] = useState("")
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosInstance.post("api/companies/create/", company)
        if (response.status === 201) {
          console.log(response);
          showSuccess("Company Created");
          navigate(`/auth/register-employer`, { state: { companyId: response.data.id, registerEmail: adminEmail } });
        }
    } catch (error) { 
        console.log(error);
        setErrors(error.response.data);
        showError("Creating Company Failed");
    };
    }
  

  return (
    <Card className="h-screen w-full flex justify-center items-center">
      <CardHeader>Create a Company</CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4">
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                type="text"
                name="company_name"
                value={company.company_name}
                onChange={(e) =>
                  setCompany({ ...company, company_name: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                type="text"
                name="website"
                value={company.website}
                onChange={(e) => setCompany({ ...company, website: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="about">About</Label>
              <Input
                type="text"
                name="about"
                value={company.about}
                onChange={(e) => setCompany({ ...company, about: e.target.value })}
              />
            <div>
              <Label htmlFor='admin_email'>Admin Email</Label>
              <Input
                type="email"
                name="admin_email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
            </div>
            </div>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCompany;
