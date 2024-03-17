import React, { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import { Switch, Space } from "antd";
import JobSearchBar from "../../../components/search/JobSearchBar";
import "./switch.css";

function EmployerDashBoardPage() {
  const { user } = useContext(AuthContext)
  const userId = user.user_id
  const [EmployerJobs, setEmployerJobs] = useState([])
  const [companyJobs, setCompanyJobs] = useState([])
  const [showCompanyJobs, setShowCompanyJobs] = useState(false);

  useEffect(() => {
    Promise.all([
      AxiosInstance.get(`api/employer/${userId}/jobs/`),
      AxiosInstance.get(`api/employer/${userId}/company-jobs/`)
    ]).then((responses) => {
      setEmployerJobs(responses[0].data)
      setCompanyJobs(responses[1].data)
      setShowCompanyJobs(responses[1].data.length > 0)
    }).catch((error) => console.error('Error fetching data:', error))
  }, [userId])

  const handleSwitchChange = (checked) => {
    setShowCompanyJobs(checked);
  };

  return (
    <div>
      <h1>Employer Dashboard</h1>
      {companyJobs.length > 0 && (
        <>
          <Switch
            checkedChildren="Company Jobs"
            unCheckedChildren="Your Jobs"
            defaultChecked
            onChange={handleSwitchChange}
          />
          <Space size={10} direction='vertical'/>
        </>
      )}
      {showCompanyJobs ? (
        <div>
          <h2>All Company Jobs</h2>
          <JobSearchBar database={companyJobs} /> 
        </div>
      ) : (
        <div>
          <h2>Jobs You Are Associated With</h2>
          <JobSearchBar database={EmployerJobs} />
        </div>
      )}
    </div>
  )
}

export default EmployerDashBoardPage
