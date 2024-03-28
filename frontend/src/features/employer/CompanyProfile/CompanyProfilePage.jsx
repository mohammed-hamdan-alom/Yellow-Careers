import React, { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from "@/components/Alert/alert";
import { Building2, BookOpenText, Computer } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input, Button } from "antd";
import { handleErrorAndShowMessage } from "@/components/handleErrorAndShowMessage/handleErrorAndShowMessage";
import "@/components/styling/button.css";
import "@/components/styling/tag.css";
import { Tag } from "antd";
import Swal from "sweetalert2";

function CompanyProfilePage() {
  const [currentEmployer, setCurrentEmployer] = useState([]);
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
        setCurrentEmployer(employerResponse.data);

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

  const handleRemoveEmployer = async (id) => {
    Swal.fire({
      title: "Are you sure you want to remove this employer from the company? The employer's account will be deleted.",
      showCancelButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        AxiosInstance.delete(`api/employers/${id}/update/`)
          .then(() => {
            Swal.fire("Removed", "The employer has been removed successfully and their account has been deleted!", "success").then(
              () => {
                window.location.reload();
              }
            );
          })
          .catch((error) => {
            console.error("Error removing employer:", error);
            Swal.fire("Error", "There was an error removing the employer.", "error");
          });
      }
    });
  };

  return (
    <div>
      {!showEdit && (
        <div>
          <div className="mb-3">
            <Label htmlFor="company_name" className="text-2xl font-bold flex items-center">
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
          {currentEmployer.is_company_admin && (
            <div className="mt-5">
              <Button
                className="yellow-button"
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
          <Button type="submit" className="blue-button mr-2" onClick={handleSubmit}>
            Update
          </Button>
          <Button type="button" className="red-button" onClick={() => setShowEdit(false)}>
            Cancel
          </Button>
        </form>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <Label className="text-2xl font-bold mb-4">Employers:</Label>
        <ul className="space-y-4">
          {employers.map((employer) => (
            <li key={employer.id} className="border p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Label htmlFor={`employer-${employer.id}`} className="text-lg font-semibold">
                    {employer.first_name} {employer.last_name}
                    {employer.is_company_admin && (
                      <Tag color="green" className="tag-medium ml-2">
                        Admin
                      </Tag>
                  )}
                  </Label>
                  {currentEmployer.is_company_admin && !employer.is_company_admin && (
                    <Button
                      onClick={() => handleRemoveEmployer(employer.id)}
                      className="red-button ml-2"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="flex items-center">
                  <Label htmlFor={`employer-email-${employer.id}`} className="text-gray-600">
                    Email: {employer.email}
                  </Label>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {currentEmployer.is_company_admin && (
        <div className="mt-3">
          <Label className="text-2xl font-bold">Invite Employers:</Label>
          <form onSubmit={handleInviteSubmit}>
            <div className="mt-2 mb-3">
              <Input
                type="email"
                placeholder="Enter employer's email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </div>
            <Button htmlType="submit" className="blue-button">
              Send Invite
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
export default CompanyProfilePage;
