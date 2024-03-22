import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from "@/utils/AxiosInstance";
import ApplicantSummary from "@/features/employer/job_applicants/ApplicantSummary"
import { Label } from '@/components/ui/label';
import { Button, Select, Tag, Pagination } from 'antd';
import '@/components/styling/button.css';
import '@/components/styling/filter.css';
import '@/components/styling/tag.css';

const JobApplicantsPage = () => {

  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [decisionFilter, setDecisionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { jobId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await AxiosInstance.get(`api/applications/job/${jobId}`);
        setApplications(response.data);
        setFilteredApplications(response.data);
      } catch (error) {
        console.error("Error:", error.response.data);
        if (error.response && (error.response.status === 403 || error.response.status === 404)) {
          window.location.href = "/employer/dashboard";
        }
        // Retry logic
        const maxRetries = 3;
        if (retryCount < maxRetries) {
          const delay = 2000; // 2 seconds delay, adjust as needed
          console.log(`Retrying after ${delay} milliseconds...`);
          setTimeout(() => {
            fetchApplicants(retryCount + 1); // Retry with incremented retryCount
          }, delay);
        } else {
          console.error("Max retries exceeded. Unable to fetch data.");
          // Handle max retries exceeded, maybe display an error message
        }
      }
    };
    fetchApplications();
>>>>>>> origin/main
  }, []);
  

  useEffect(() => {
    const filtered = applications.filter(application => 
        (statusFilter === 'all' || application.status === statusFilter) &&
        (decisionFilter === 'all' || application.decision === decisionFilter)
    );

    setFilteredApplications(filtered);
  }, [statusFilter, decisionFilter, applications]);

  const handleShowDetails = () => {
    navigate(`/employer/job-details/${jobId}`);
  }

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
  };

  // Logic to calculate the subset of results for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageApplications = filteredApplications.slice(startIndex, endIndex);

  return (
    <div>
      <div>
        <Button className='yellowButton mb-2' onClick={handleShowDetails}> Job Details </Button>
      </div>
      <div>
        <Label className="text-3xl font-bold">Matched applicants</Label>
      </div>
      <div className="filter-container">
        <div className="filter-item">
        <Label className="text-xl"><Tag color="purple" className="tag-medium">Status Filter:</Tag></Label>
        <Select data-testid='status' id="status" className="w-60 mt-2" defaultValue="all" onChange={value => setStatusFilter(value)}>
          <Select.Option value="all">All</Select.Option>
          <Select.Option value="U">Unread</Select.Option>
          <Select.Option value="R">Read</Select.Option>
        </Select>
        </div>
        <div className="filter-item">
        <Label className="text-xl"><Tag color="pink" className="tag-medium">Decision Filter:</Tag></Label>
        <Select data-testid='decision' id="decision" className="w-60 mt-2" defaultValue="all" onChange={value => setDecisionFilter(value)}>
          <Select.Option value="all">All</Select.Option>
          <Select.Option value="U">Undecided</Select.Option>
          <Select.Option value="R">Rejected</Select.Option>
          <Select.Option value="A">Accepted</Select.Option>
        </Select>
        </div>
      </div>
      {currentPageApplications.map(application => (
        <ul key={application.id}>
          <ApplicantSummary application_id={application.id} status={application.status} decision={application.decision}/>
        </ul>
      ))}
      <Pagination
        className="mt-8"
        current={currentPage}
        pageSize={pageSize}
        total={filteredApplications.length}
        showSizeChanger
        onChange={handlePageChange}
        onShowSizeChange={handlePageSizeChange}
      />
    </div>
  );
}

export default JobApplicantsPage;