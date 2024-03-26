import React, { useEffect, useState } from "react";
import JobList from "@/components/Search/JobList";
import AxiosInstance from "@/utils/AxiosInstance";
import { Select } from "antd";
import { Label } from "@/components/ui/label";
import "@/components/styling/filter.css";
import "@/components/styling/tag.css";
import { Tag } from "antd";

const JobFilterAndList = ({ jobs }) => {
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    pay: "all",
    contractType: "all",
    location: "all", //Location is treated as only country
  });
  const [countries, setCountries] = useState([]);

  const onPayChangeFilter = (e) => {
    const value = e;
    setFilters({
      ...filters,
      pay: value,
    });
    applyFilters(value, filters.contractType, filters.location);
  };

  const onCTChangeFilter = (e) => {
    const value = e;
    setFilters({
      ...filters,
      contractType: value,
    });
    applyFilters(filters.pay, value, filters.location);
  };

  const onLocationChangeFilter = (e) => {
    const value = e;
    setFilters({
      ...filters,
      location: value,
    });
    applyFilters(filters.pay, filters.contractType, value);
  };

  const applyFilters = (pay, ct, location) => {
    const payFilter = (job) => job.salary >= pay;
    const ctFilter = (job) => job.job_type == ct;
    const locationFilter = (job) => job.address.country == location;

    let filters = [];
    let filteredResults = jobs;

    if (pay !== "all") {
      filters.push(payFilter);
    }
    if (ct !== "all") {
      filters.push(ctFilter);
    }
    if (location != "all") {
      filters.push(locationFilter);
    }
    if (filters.length !== 0) {
      filteredResults = filters.reduce((d, f) => d.filter(f), jobs);
    }

    setResults(filteredResults);
  };

  //Gets unique countries from all addresses
  useEffect(() => {
    AxiosInstance.get(`api/addresses/`)
      .then((res) => {
        const countries = res.data.map((address) => address.country);
        setCountries(Array.from(new Set(countries)));
      })
      .catch((error) => console.log(error));
  }, []);

  //Refreshes job list once data has been received
  useEffect(() => {
    setResults(jobs);
  }, [jobs]);

  return (
    <div>
      <div className="filter-container">
        <div className="filter-item">
          <Label className="text-xl">
            <Tag color="green" className="tag-medium">
              Location:
            </Tag>
          </Label>
          <Select
            data-testid="location"
            showSearch
            id="location"
            className="w-60 mt-2"
            defaultValue="all"
            onChange={onLocationChangeFilter}
            title="LocationFilter"
          >
            <Select.Option value="all">All</Select.Option>
            {countries.map((country, i) => (
              <Select.Option value={country} key={i}>
                {country}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="filter-item">
          <Label className="text-xl">
            <Tag color="blue" className="tag-medium">
              Salary:
            </Tag>
          </Label>
          <Select
            data-testid="pay"
            className="w-40 mt-2"
            id="pay"
            defaultValue="all"
            onChange={onPayChangeFilter}
            title="PayFilter"
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="20000">£20,000+</Select.Option>
            <Select.Option value="25000">£25,000+</Select.Option>
            <Select.Option value="30000">£30,000+</Select.Option>
            <Select.Option value="35000">£35,000+</Select.Option>
            <Select.Option value="45000">£45,000+</Select.Option>
            <Select.Option value="100000">£100,000+</Select.Option>
          </Select>
        </div>

        <div className="filter-item">
          <Label className="text-xl">
            <Tag color="purple" className="tag-medium">
              Job Type:
            </Tag>
          </Label>
          <Select
            data-testid="jobType"
            id="jobType"
            className="w-40 mt-2"
            defaultValue="all"
            onChange={onCTChangeFilter}
            title="ContractFilter"
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="FT">Full-Time</Select.Option>
            <Select.Option value="PT">Part-Time</Select.Option>
            <Select.Option value="IN">Internship</Select.Option>
            <Select.Option value="TM">Temporary</Select.Option>
          </Select>
        </div>
      </div>

      <JobList jobs={results} />
    </div>
  );
};

export default JobFilterAndList;
