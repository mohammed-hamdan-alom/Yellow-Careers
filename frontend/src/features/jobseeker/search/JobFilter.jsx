import React, { useEffect, useState } from "react";
import JobSearchBar from "./JobSearchBar";

const JobFilter = ({ database }) => {
  const [results, setResults] = useState([]);

  const onPayChangeFilter = (value) => {
    if (value == "all") {
      setResults(database)
    }
    else {
      const filteredResults = database.filter(item => item.salary > value)
      setResults(filteredResults)
    }
  }

  useEffect(() => {
    setResults(database);
  }, [database]);

  return (
    <div>
      <label htmlFor="filterDropdown">Location:</label>
      <select id="location" onChange={(e) => onChangeFilter(e.target.value)} title="LocationFilter">
        <option value="all">All</option>
      </select>

      <br></br>

      <label htmlFor="filterDropdown">Pay:</label>
      <select id="pay" onChange={(e) => onPayChangeFilter(e.target.value)} title="PayFilter">
        <option value="all">All</option>
        <option value="20000">£20,000+</option>
        <option value="25000">£25,000+</option>
        <option value="30000">£30,000+</option>
        <option value="35000">£35,000+</option>
        <option value="45000">£45,000+</option>
        <option value="100000">£100,000+</option>

      </select>

      <br></br>

      <label htmlFor="filterDropdown">Contract Type:</label>
      <select id="contractType" onChange={(e) => onChangeFilter(e.target.value)} title="ContractFilter">
        <option value="all">All</option>
        <option value="FT">Full-Time</option>
        <option value="PT">Part-Time</option>
        <option value="IN">Internship</option>
        <option value="TM">Temporary</option>
      </select>

      <br></br>

      <JobSearchBar database={results}></JobSearchBar>
    </div>


  );
};

export default JobFilter;
