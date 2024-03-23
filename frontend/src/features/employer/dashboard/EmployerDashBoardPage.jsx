import React, { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import { Switch, Space } from "antd";
import JobList from "../../../components/search/JobList";
import { Label } from "@/components/ui/label";
import "./switch.css";

function EmployerDashBoardPage() {
  const { user } = useContext(AuthContext);
  const userId = user.user_id;
  const [employerJobs, setEmployerJobs] = useState([]);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [showCompanyJobs, setShowCompanyJobs] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employerJobsResponse = await AxiosInstance.get(`api/employer/${userId}/jobs/`);
        setEmployerJobs(employerJobsResponse.data);

        const companyJobsResponse = await AxiosInstance.get(`api/employer/${userId}/company-jobs/`);
        setCompanyJobs(companyJobsResponse.data);
        setShowCompanyJobs(companyJobsResponse.data.length > 0);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchData();
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
          <JobList data={companyJobs} />
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
          <JobList data={employerJobs} />
        </div>
      )}
    </div>
  );
}

export default EmployerDashBoardPage;