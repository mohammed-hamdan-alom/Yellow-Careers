import React, { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from "@/components/Alert/Alert";
import { Building2, BookOpenText, Computer } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input, Button } from "antd";
import { handleErrorAndShowMessage } from "@/components/error_handler/error_display";
import "@/components/styling/button.css";

function CompanyProfilePage() {
  const [employer, setEmployer] = useState([]);
  const [companyData, setCompanyData] = useState({
    company_name: "",
    about: "",
    website: "",
  });
  const [editedCompanyData, setEditedCompanyData] = useState({
    company_name: "",
    about: "",
    website: "",
  });
  const [showEdit, setShowEdit] = useState(null);
  const [employers, setEmployers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState("");

  const { user } = useContext(AuthContext);
  const userId = user.user_id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employerResponse = await AxiosInstance.get(`api/employers/${userId}`);
        setEmployer(employerResponse.data);

        const companyResponse = await AxiosInstance.get(
          `api/companies/${employerResponse.data.company}`,
        );
        setCompanyData({
          company_name: companyResponse.data.company_name,
          about: companyResponse.data.about,
          website: companyResponse.data.website,
          id: companyResponse.data.id,
        });

        const employersResponse = await AxiosInstance.get(
          `api/companies/${companyResponse.data.id}/employers`,
        );
        setEmployers(employersResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const [errors, setErrors] = useState({
    company_name: "",
    about: "",
    website: "",
  });

  const handleChange = (event) => {
    setEditedCompanyData({
      ...editedCompanyData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await AxiosInstance.put(
        `api/companies/${companyData.id}/update/`,
        editedCompanyData,
      );
      showSuccess("Company Profile Updated");
      setShowEdit(false);
      setCompanyData(editedCompanyData);
    } catch (error) {
      console.error(error);
      setErrors(error.response.data);
      showError("Company Profile Update Failed");
    }
  };

  const handleInviteSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await AxiosInstance.post("/api/invited-employer/create/", {
        email: inviteEmail,
        company: companyData.id,
      });
      if (response.status === 200 || response.status === 201) {
        showSuccess("Invitation sent successfully.");
        setInviteEmail("");
      }
    } catch (error) {
      handleErrorAndShowMessage("Failed to send invite:", error);
    }
  };

  return (
    <div>
      {!showEdit && (
        <div>
          <div className="mb-3">
            <Label htmlFor="company_name" className="flex items-center">
              <Building2 size={16} className="mr-3" />
              {companyData.company_name}
            </Label>
          </div>
          <div className="mb-3">
            <Label htmlFor="about">About: </Label>
            <Input
              type="text"
              prefix={<BookOpenText size={15} />}
              id="about"
              name="about"
              disabled
              value={companyData.about}
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="website">Website: </Label>
            <Input
              type="text"
              prefix={<Computer size={15} />}
              id="website"
              name="website"
              disabled
              value={companyData.website}
            />
          </div>
          {employer.is_company_admin && (
            <div className="mt-5">
              <Button
                className="yellowButton"
                type="submit"
                onClick={() => {
                  setEditedCompanyData(companyData);
                  setShowEdit(true);
                }}
              >
                Edit
              </Button>
            </div>
          )}
          <br />
        </div>
      )}

      {showEdit && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Label htmlFor="company_name">
              Company Name:
              <Input
                prefix={<Building2 size={16} className="mr-3" />}
                type="text"
                id="company_name"
                name="company_name"
                value={editedCompanyData.company_name}
                onChange={handleChange}
              />
            </Label>
            {errors.company_name && <p>{errors.company_name}</p>}
          </div>
          <div className="mb-3">
            <Label htmlFor="about">
              About:
              <Input.TextArea
                id="about"
                name="about"
                value={editedCompanyData.about}
                onChange={handleChange}
              />
            </Label>
            {errors.about && <p>{errors.about}</p>}
          </div>
          <div className="mb-3">
            <Label htmlFor="website">
              Website:
              <Input
                type="text"
                id="website"
                name="website"
                value={editedCompanyData.website}
                onChange={handleChange}
              />
            </Label>
            {errors.website && <p>{errors.website}</p>}
          </div>
          <Button type="submit" className="blueButton mr-2" onClick={handleSubmit}>
            Update
          </Button>
          <Button type="button" className="redButton" onClick={() => setShowEdit(false)}>
            Cancel
          </Button>
        </form>
      )}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Employers:</h1>
        <ul className="space-y-4">
          {employers.map((employer) => (
            <li key={employer.id} className="border p-4 rounded-md">
              <div className="flex justify-between items-center">
                <Label htmlFor={`employer-${employer.id}`} className="text-lg font-semibold">
                  {employer.first_name} {employer.last_name}
                </Label>
                <Label htmlFor={`employer-email-${employer.id}`} className="text-gray-600">
                  Email: {employer.email}
                </Label>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {employer.is_company_admin && (
        <div>
          <Label className="text-lg font-semibold">Invite Employers:</Label>
          <form onSubmit={handleInviteSubmit}>
            <div className="mb-3">
              <Input
                type="email"
                placeholder="Enter employer's email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </div>
            <Button htmlType="submit" className="blueButton">
              Send Invite
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
export default CompanyProfilePage;
