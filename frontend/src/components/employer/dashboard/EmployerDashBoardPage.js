import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import AxiosInstance from '../../../Axios';
import { Switch, Space } from "antd";
import '../job_summary/JobSummary.css';
import JobSummary from "../job_summary/JobSummary";

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
            unCheckedChildren="Employer Jobs"
            defaultChecked
            onChange={handleSwitchChange}
          />
          <Space size={10} direction='vertical'/>
        </>
      )}
      {showCompanyJobs ? (
        <div>
          <h2>All Company Jobs</h2>
          {companyJobs.map(job => (
            <ul className='job-summary' key={job.id}>
              <JobSummary job={job} />
            </ul>
          ))}
        </div>
      ) : (
        <div>
          <h2>Jobs you are associated with</h2>
          {EmployerJobs.map(job => (
            <ul className='job-summary' key={job.id}>
              <JobSummary job={job} />
            </ul>
          ))}
        </div>
      )}
    </div>
  )
}

export default EmployerDashBoardPage