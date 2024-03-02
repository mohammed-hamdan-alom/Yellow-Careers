import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../../context/AuthContext";
import AxiosInstance from "../../../Axios";
import { showError, showSuccess } from "./notificationUtils";

function CompanyProfilePage() {
  const [employer, setEmployer] = useState([]);
  const [companyData, setCompanyData] = useState({
    company_name: "",
    about: "",
    website: "",
  });
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
              id : response.data.id
            });
          }
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Company Profile</h1>
      <h2>Company Name: {companyData.company_name}</h2>
      <h2>About: {companyData.about}</h2>
      <h2>Website: {companyData.website}</h2>
      {employer.is_company_admin && (
        <Link
          to={{
            pathname: "/employer/company/edit",
            state: {
              companyData: companyData,
            },
          }}
          className="btn btn-primary"
        >
          Edit
        </Link>
      )}
      <h1>Employers:</h1>
    </div>
  );
}
export default CompanyProfilePage;
