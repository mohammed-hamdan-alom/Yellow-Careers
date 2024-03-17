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
    Promise.all([
      AxiosInstance.get(`api/employer/${userId}/jobs/`),
      AxiosInstance.get(`api/employer/${userId}/company-jobs/`),
    ])
      .then((responses) => {
        setEmployerJobs(responses[0].data);
        setCompanyJobs(responses[1].data);
        setShowCompanyJobs(responses[1].data.length > 0);
      })
      .catch((error) => console.error("Error fetching data:", error));
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
            <Switch
              checkedChildren="Company Jobs"
              unCheckedChildren="Your Jobs"
              defaultChecked
              onChange={handleSwitchChange}
            />
          </div>
          <JobSearchBar database={companyJobs} />
        </div>
      ) : (
        <div>
          <Label className="text-3xl">Jobs You Are Associated With</Label>
          <Space size={10} direction="vertical" />
          <div>
            <Switch
              checkedChildren="Company Jobs"
              unCheckedChildren="Your Jobs"
              defaultChecked
              onChange={handleSwitchChange}
            />
          </div>
          <JobSearchBar database={employerJobs} />
        </div>
      )}
    </div>
  );
}

export default EmployerDashBoardPage;
