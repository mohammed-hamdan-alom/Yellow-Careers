import React, { useState } from "react";
import { Switch, Space } from "antd";
import { Label } from "@/components/ui/label";
import "./switch.css";
import JobFilterAndList from "@/components/Search/JobFilterAndList";

const ToggleCompanyEmployerJobs = ({ isAdmin, companyJobs, employerJobs, text }) => {
  const [showCompanyJobs, setShowCompanyJobs] = useState(isAdmin);

  const handleSwitchChange = (checked) => {
    setShowCompanyJobs(checked);
  };

  if (companyJobs.length === 0 && employerJobs.length === 0) {
    return <Label className="text-3xl text-gray-700">There are no {text} jobs to view.</Label>;
  }

  return (
    <div>
      {showCompanyJobs ? (
        <div>
          <Label className="text-3xl">All Company {text} Jobs</Label>
          <Space size={10} direction="vertical" />
          <div>
            {isAdmin && (
              <Switch
                checkedChildren="Company Jobs"
                unCheckedChildren="Your Jobs"
                defaultChecked={showCompanyJobs}
                onChange={handleSwitchChange}
              />
            )}
          </div>
          <JobFilterAndList jobs={companyJobs} />
        </div>
      ) : (
        <div>
          <Label className="text-3xl">{text} Jobs You Are Associated With</Label>
          <Space size={10} direction="vertical" />
          <div>
            {isAdmin && (
              <Switch
                checkedChildren="Company Jobs"
                unCheckedChildren="Your Jobs"
                defaultChecked={showCompanyJobs}
                onChange={handleSwitchChange}
              />
            )}
          </div>
          <JobFilterAndList jobs={employerJobs} />
        </div>
      )}
    </div>
  );
};

export default ToggleCompanyEmployerJobs;
