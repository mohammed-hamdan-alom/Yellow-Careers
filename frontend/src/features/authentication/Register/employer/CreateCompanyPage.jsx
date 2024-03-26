import React from "react";
import { useState, useEffect } from "react";
import AxiosInstance from "@/utils/AxiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "@/components/Alert/Alert";

const CreateCompanyPage = () => {
  const [company, setCompany] = useState({
    company_name: "",
    website: "",
    about: "",
  });
  const [adminEmail, setAdminEmail] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosInstance.post("api/companies/create/", company);
      if (response.status === 201) {
        console.log(response);
        showSuccess("Company Created");
        navigate(`/auth/register-employer`, {
          state: {
            companyId: response.data.id,
            registerEmail: adminEmail,
            isAdmin: true,
          },
        });
      }
    } catch (error) {
      console.log(error);
      setErrors(error.response.data);
      showError("Creating Company Failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-[600px]">
        <CardHeader>
          <CardTitle>Create a Company</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={company.company_name}
                  onChange={(e) => setCompany({ ...company, company_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  type="text"
                  id="website"
                  name="website"
                  value={company.website}
                  onChange={(e) => setCompany({ ...company, website: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="about">About</Label>
                <Input
                  type="text"
                  id="about"
                  name="about"
                  value={company.about}
                  onChange={(e) => setCompany({ ...company, about: e.target.value })}
                />
                <div className="mt-4">
                  <Label htmlFor="admin_email">Admin Email</Label>
                  <Input
                    type="email"
                    id="admin_email"
                    name="admin_email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" data-testid="submit-button">
                Create
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCompanyPage;
