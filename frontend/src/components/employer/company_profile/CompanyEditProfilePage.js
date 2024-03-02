import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import AxiosInstance from "../../../Axios";
import { showSuccess } from "./notificationUtils";
import { useLocation } from "react-router-dom";

function CompanyEdiProfilePage() {
  const location = useLocation();
  const [companyData, setCompanyData] = useState(location.state.companyData);
  console.log(companyData);
  const [errors, setErrors] = useState({
    company_name: "",
    about: "",
    website: "",
  });

  const handleChange = (event) => {
    setCompanyData({
      ...companyData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    AxiosInstance.put(`api/companies/${companyData.id}/update`, companyData)
      .then((response) => {
        showSuccess("Company Profile Updated");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Company Name</label>
          <input
            type="text"
            name="company_name"
            value={companyData.company_name}
            onChange={handleChange}
          />
          {errors.company_name && errors.company_name}
        </div>
        <div>
          <label>About</label>
          <textarea
            name="about"
            value={companyData.about}
            onChange={handleChange}
          />
          {errors.about && errors.about}
        </div>
        <div>
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={companyData.website}
            onChange={handleChange}
          />
          {errors.website && errors.website}
        </div>
      </form>
    </div>
  );
}
export default CompanyEdiProfilePage;
