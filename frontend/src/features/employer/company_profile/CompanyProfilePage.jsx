import React, { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import { showError, showSuccess } from "@/shared/Alert/Alert";

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
          <h1>{companyData.company_name}</h1>
          <h3>About: </h3><p>{companyData.about}</p>
          <h3>Website: </h3><p>{companyData.website}</p>
          {employer.is_company_admin && (
            <button onClick={() => { setEditedCompanyData(companyData); setShowEdit(true) }}>Edit</button>
          )}
        </div>
      )}
      {showEdit && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Company Name</label>
            <input
              type="text"
              name="company_name"
              value={editedCompanyData.company_name}
              onChange={handleChange}
            />
            {errors.company_name && <p>{errors.company_name}</p>}
          </div>
          <div>
            <label>About</label>
            <textarea
              name="about"
              value={editedCompanyData.about}
              onChange={handleChange}
            />
            {errors.about && <p>{errors.about}</p>}
          </div>
          <div>
            <label>Website</label>
            <input
              type="text"
              name="website"
              value={editedCompanyData.website}
              onChange={handleChange}
            />
            {errors.website && <p>{errors.website}</p>}
          </div>
          <button type="submit">Update</button>
          <button type="button" onClick={() => setShowEdit(false)}>Cancel</button>
        </form>
      )}
      <h1>Employers:</h1>
      <ul>
        {employers.map((employer) => (
          <li key={employer.id}>
            {employer.first_name} {employer.last_name}: {employer.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default CompanyProfilePage;
