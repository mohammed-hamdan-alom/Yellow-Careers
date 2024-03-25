import React, { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import { Switch, Space } from "antd";
import { Label } from "@/components/ui/label";
import "./switch.css";
import JobFilter from "@/components/search/JobFilter";
import { checkUserIdAndReload } from "@/components/refreshUser/refreshUser";


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

        const jobsWithCompany = await Promise.all(employerJobsResponse.data.map(async job => {
          const companyRes = await AxiosInstance.get(`api/jobs/${job.id}/company/`);
          return { ...job, company: companyRes.data };
        }));     
        setEmployerJobs(jobsWithCompany);

        const employerResponse = await AxiosInstance.get(`api/employers/${userId}/`);

        if (employerResponse.data.is_company_admin) {
          const companyJobsResponse = await AxiosInstance.get(`api/employer/${userId}/company-jobs/`);
          const jobsWithCompany = await Promise.all(companyJobsResponse.data.map(async job => {
            const companyRes = await AxiosInstance.get(`api/jobs/${job.id}/company/`);
            return { ...job, company: companyRes.data };
          }));     
          setCompanyJobs(jobsWithCompany);
          setShowCompanyJobs(jobsWithCompany.length > 0);
        }


      } catch (error) {
        checkUserIdAndReload(userId)
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
          <JobFilter data={companyJobs} />
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
          <JobFilter data={employerJobs} />
        </div>
      )}
    </div>
  );
}

export default EmployerDashBoardPage;