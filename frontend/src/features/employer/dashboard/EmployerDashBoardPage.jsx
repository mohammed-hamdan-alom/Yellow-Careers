import React, { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import { Switch, Space } from "antd";
import JobSearchBar from "@/components/search/JobSearchBar";
import { Label } from "@/components/ui/label";
import "./switch.css";

function EmployerDashBoardPage() {
  const { user } = useContext(AuthContext);
  const userId = user.user_id;
  const [employerJobs, setEmployerJobs] = useState([]);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [showCompanyJobs, setShowCompanyJobs] = useState(false);

  useEffect(() => {
    AxiosInstance.get(`api/employer/${userId}/jobs/`)
      .then((response) => {
        setEmployerJobs(response.data);
      })
      .catch((error) => console.error('Error fetching employer jobs:', error));
    
    AxiosInstance.get(`api/employer/${userId}/company-jobs/`)
      .then((response) => {
        setCompanyJobs(response.data);
        setShowCompanyJobs(response.data.length > 0);
      })
      .catch((error) => console.error('Error fetching company jobs:', error));
  }, [userId]);

  const handleSwitchChange = (checked) => {
    setShowCompanyJobs(checked);
  };

  return (
    <div>
      {showCompanyJobs ? (
        <div>
          <Label className="text-3xl">All Company Jobs</Label>
          <Space size={10} direction="vertical" />
          <div>
            {companyJobs.length > 0 && (
              <Switch
                checkedChildren="Company Jobs"
                unCheckedChildren="Your Jobs"
                defaultChecked={showCompanyJobs}
                onChange={handleSwitchChange}
              />
            )}
          </div>
          <JobSearchBar database={companyJobs} /> 
        </div>
      ) : (
        <div>
          <Label className="text-3xl">Jobs You Are Associated With</Label>
          <Space size={10} direction="vertical" />
          <div>
            {companyJobs.length > 0 && (
              <Switch
                checkedChildren="Company Jobs"
                unCheckedChildren="Your Jobs"
                defaultChecked={showCompanyJobs}
                onChange={handleSwitchChange}
              />
            )}
          </div>
          <JobSearchBar database={employerJobs} />
        </div>
      )}
    </div>
  );
}

export default EmployerDashBoardPage;