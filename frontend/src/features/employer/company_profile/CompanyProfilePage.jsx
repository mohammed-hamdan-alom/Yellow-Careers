import React, { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from "@/components/Alert/Alert";
import { Mail, Phone, Calendar, Earth, MapPin, Building2, BookOpenText, Computer     } from 'lucide-react';
import { UserOutlined } from '@ant-design/icons';
import { Label } from "@/components/ui/label";
import { Input,Select, Button } from "antd";
const { Option } = Select;
import './styling/styling.css'

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
  const { user } = useContext(AuthContext);
  const userId = user.user_id;

  useEffect(() => {
    AxiosInstance.get(`api/employers/${userId}`)
      .then((response) => {
        setEmployer(response.data);
        AxiosInstance.get(`api/companies/${response.data.company}`).then(
          (response) => {
            setCompanyData({
              company_name: response.data.company_name,
              about: response.data.about,
              website: response.data.website,
              id: response.data.id,
            });
            AxiosInstance.get(
              `api/companies/${response.data.id}/employers`
            ).then((response) => {
              setEmployers(response.data);
            });
          }
        );
      })
      .catch((error) => {
        console.error(error);
      });
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

  const handleSubmit = (event) => {


    event.preventDefault();
    AxiosInstance.put(`api/companies/${companyData.id}/update/`, editedCompanyData)
      .then((response) => {
        showSuccess("Company Profile Updated");
        setShowEdit(false);
        setCompanyData(editedCompanyData);
      })
      .catch((error) => {
        console.error(error);
        setErrors(error.response.data);
        showError("Company Profile Update Failed");
      });
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
            <Label htmlFor="about" >About: </Label>
            <Input type="text" prefix={<BookOpenText size={15}/>} id="about" name="about" disabled value={companyData.about} />
          </div>
          <div className="mb-3">
            <Label htmlFor="website" >Website: </Label>
            <Input type="text" prefix={<Computer size={15}/>} id="website" name="website" disabled value={companyData.website} />
          </div>
          {employer.is_company_admin && (
            <div style={{ marginTop: '25px' }}>
            <Button className="editButton" type="submit" onClick={() => {setEditedCompanyData(companyData);setShowEdit(true)}}>Edit</Button>
          </div>
          )}
          <br/>
        </div>
      )}
      {showEdit && (
        
        <form onSubmit={handleSubmit}>
        <div className="mb-3">
        <Label htmlFor="company_name"> Company Name: 
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
          <label htmlFor="about">About</label>
          <Input.TextArea
            id="about"
            name="about"
            value={editedCompanyData.about}
            onChange={handleChange}
          />
          {errors.about && <p>{errors.about}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="website">Website</label>
          <Input
            type="text"
            id="website"
            name="website"
            value={editedCompanyData.website}
            onChange={handleChange}
          />
          {errors.website && <p>{errors.website}</p>}
        </div>
        <Button type="submit" className="updateButton" onClick={handleSubmit}>Update</Button>
        <Button type="button" className="cancelButton" onClick={() => setShowEdit(false)}>Cancel</Button>
      </form>
    )}
      <div>
  <h1>Employers:</h1>
  <br/>
  <ul>
    {employers.map((employer) => (
      <li key={employer.id} className="employer-item">
        <div className="employer-info">
          <Label htmlFor={`employer-${employer.id}`} className="flex items-center">
            {employer.first_name} {employer.last_name}:
          </Label>
          <Label htmlFor={`employer-email-${employer.id}`} className="flex items-center">Email: {employer.email}</Label>
        </div>
      </li>
    ))}
  </ul>
</div>

    </div>
  );
}
export default CompanyProfilePage;
