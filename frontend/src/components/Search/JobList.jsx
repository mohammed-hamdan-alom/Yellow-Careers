import React, { useEffect, useState } from "react";
import JobSummary from "../JobSummary/JobSummary";
import { Input } from "@/components/ui/input";
import { Pagination } from "antd";

const JobList = ({ jobs }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSearch = (e) => {
    const query = e.target.value;
    setQuery(query);
    const titleFilter = (job) => job.title.toLowerCase().includes(query.toLowerCase());
    const descriptionFilter = (job) => job.description.toLowerCase().includes(query.toLowerCase());
    const companyFilter = (job) => job.company.company_name.toLowerCase().includes(query.toLowerCase());

    const filteredResults = jobs.filter((job) => titleFilter(job) || descriptionFilter(job) || companyFilter(job));

    setResults(filteredResults)
    setCurrentPage(1); // Reset to the first page when performing a new search
  };

  useEffect(() => {
    setResults(jobs);
  }, [jobs]);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
  };

  // Logic to calculate the subset of results for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageResults = results.slice(startIndex, endIndex);

  return (
    <>
      <Input
        className="form-control mt-4"
        type="text"
        data-testid="jobsearchbar"
        value={query}
        onChange={handleSearch}
        placeholder="Search Jobs"
      />
      {currentPageResults.map((job) => (
        <ul key={job.id}>
          <JobSummary job={job} />
        </ul>
      ))}
      <Pagination
        className="mt-8"
        current={currentPage}
        pageSize={pageSize}
        total={results.length}
        showSizeChanger
        onChange={handlePageChange}
        onShowSizeChange={handlePageSizeChange}
      />
    </>
  );
};

export default JobList;
