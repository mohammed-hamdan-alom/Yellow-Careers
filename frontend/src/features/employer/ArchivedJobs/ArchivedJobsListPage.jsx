import React, { useContext, useEffect, useState } from "react";
import AuthContext from "@/context/AuthContext";
import AxiosInstance from "@/utils/AxiosInstance";
import { Switch, Space } from "antd";
import { Label } from "@/components/ui/label";
import "../styling/switch.css";
import JobFilterAndList from "@/components/Search/JobFilterAndList";

function ArchivedJobsListPage() {
  const { user } = useContext(AuthContext);
  const userId = user.user_id;
  const [archivedJobs, setArchivedJobs] = useState([]);
  const [companyArchivedJobs, setCompanyArchivedJobs] = useState([]);
  const [showCompanyArchivedJobs, setShowCompanyArchivedJobs] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const archivedJobsResponse = await AxiosInstance.get(
          `api/employer/${userId}/jobs/archived/`
        );
        const jobsWithCompany = await Promise.all(
          archivedJobsResponse.data.map(async (job) => {
            const companyRes = await AxiosInstance.get(`api/jobs/${job.id}/company/`);
            return { ...job, company: companyRes.data };
          })
        );
        setArchivedJobs(jobsWithCompany);

        const employerResponse = await AxiosInstance.get(`api/employers/${userId}/`);

        if (employerResponse.data.is_company_admin) {
          const companyArchivedJobsResponse = await AxiosInstance.get(
            `api/employer/${userId}/company-jobs/archived/`
          );
          const jobsWithCompany = await Promise.all(
            companyArchivedJobsResponse.data.map(async (job) => {
              const companyRes = await AxiosInstance.get(`api/jobs/${job.id}/company/`);
              return { ...job, company: companyRes.data };
            })
          );
          setCompanyArchivedJobs(jobsWithCompany);
          setShowCompanyArchivedJobs(jobsWithCompany.length > 0);
        }
      } catch (error) {
        console.error("Error fetching archived jobs:", error);
      }
    };

    fetchData();
  }, [userId]);

  const handleSwitchChange = (checked) => {
    setShowCompanyArchivedJobs(checked);
  };

  return (
    <div>
      {showCompanyArchivedJobs ? (
        <div>
          <Label className="text-3xl">All Company Archived Jobs</Label>
          <Space size={10} direction="vertical" />
          <div>
            {companyArchivedJobs.length > 0 && (
              <Switch
                checkedChildren="Company Jobs"
                unCheckedChildren="Your Jobs"
                defaultChecked={showCompanyArchivedJobs}
                onChange={handleSwitchChange}
              />
            )}
          </div>
          <JobFilterAndList jobs={companyArchivedJobs} />
        </div>
      ) : (
        <div>
          <Label className="text-3xl">Archived Jobs You Are Associated With</Label>
          <Space size={10} direction="vertical" />
          <div>
            {companyArchivedJobs.length > 0 && (
              <Switch
                checkedChildren="Company Jobs"
                unCheckedChildren="Your Jobs"
                defaultChecked={showCompanyArchivedJobs}
                onChange={handleSwitchChange}
              />
            )}
          </div>
          <JobFilterAndList jobs={archivedJobs} />
        </div>
      )}
    </div>
  );
}

export default ArchivedJobsListPage;
