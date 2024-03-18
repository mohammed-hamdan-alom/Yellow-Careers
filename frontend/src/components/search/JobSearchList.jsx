import React, { useEffect, useState } from "react";
import JobSummary from "../JobSummary/JobSummary";
import { Input } from "@/components/ui/input";
import { Pagination } from "antd";

const JobSearchList = ({ data }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSearch = (e) => {
    const query = e.target.value;
    setQuery(query);
    const filteredResults = data.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filteredResults);
    setCurrentPage(1); // Reset to the first page when performing a new search
  };

  useEffect(() => {
    setResults(data);
  }, [data]);

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

export default JobSearchList;
