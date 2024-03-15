import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';
import AxiosInstance from "@/utils/AxiosInstance";
import { Switch, Space, Pagination } from "antd";
import JobSummary from '../job_summary/JobSummary';

function EmployerDashBoardPage() {
  const { user } = useContext(AuthContext);
  const userId = user.user_id;
  const [employerJobs, setEmployerJobs] = useState([]);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [showCompanyJobs, setShowCompanyJobs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Adjust the page size as needed

  useEffect(() => {
    Promise.all([
      AxiosInstance.get(`api/employer/${userId}/jobs/`),
      AxiosInstance.get(`api/employer/${userId}/company-jobs/`)
    ]).then((responses) => {
      setEmployerJobs(responses[0].data);
      setCompanyJobs(responses[1].data);
      setShowCompanyJobs(responses[1].data.length > 0);
    }).catch((error) => console.error('Error fetching data:', error));
  }, [userId]);

  const handleSwitchChange = (checked) => {
    setShowCompanyJobs(checked);
    setCurrentPage(1); // Reset to the first page when switching between company and employer jobs
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
  };

  const jobsToDisplay = showCompanyJobs ? companyJobs : employerJobs;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageJobs = jobsToDisplay.slice(startIndex, endIndex);

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
      {currentPageJobs.length > 0 && (
        <div>
          {showCompanyJobs ? (
            <div>
              <h2>All Company Jobs</h2>
              {currentPageJobs.map(job => (
                <ul className='job-summary' key={job.id}>
                  <JobSummary job={job} />
                </ul>
              ))}
            </div>
          ) : (
            <div>
              <h2>Jobs You Are Associated With</h2>
              {currentPageJobs.map(job => (
                <ul className='job-summary' key={job.id}>
                  <JobSummary job={job} />
                </ul>
              ))}
            </div>
          )}
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={jobsToDisplay.length}
            showSizeChanger
            onChange={handlePageChange}
            onShowSizeChange={handlePageSizeChange}
          />
        </div>
      )}
    </div>
  );
}

export default EmployerDashBoardPage;
