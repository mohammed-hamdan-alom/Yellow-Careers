import React, { useEffect, useState } from "react";
import JobSearchBar from "./JobSearchBar";
import AxiosInstance from "@/utils/AxiosInstance";

const JobFilter = ({ database }) => {
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    pay: "all",
    contractType: "all",
    location: "all", //Location is treated as only country
  });
  const [addresses, setAddresses] = useState([]);
  const [countries, setCountries] = useState([]);

  const getCountry = (id) => {
    const address = addresses.find(address => address.id == id)
    return address.country
  }

  const onPayChangeFilter = (e) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      pay: value,
    });
    applyFilters(value, filters.contractType, filters.location);
  }

  const onCTChangeFilter = (e) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      contractType: value,
    });
    applyFilters(filters.pay, value, filters.location);
  }

  const onLocationChangeFilter = (e) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      location: value,
    });
    applyFilters(filters.pay, filters.contractType, value);
  }

  const applyFilters = (pay, ct, location) => {
    const payFilter = (job) => job.salary >= pay;
    const ctFilter = (job) => job.job_type == ct;
    const locationFilter = (job) => getCountry(job.address) == location;

    let filters = []
    let filteredResults = database;

    if (pay !== "all") {
      filters.push(payFilter)
    }
    if (ct !== "all") {
      filters.push(ctFilter)
    }
    if (location != "all") {
      filters.push(locationFilter)
    }
    if (filters.length !== 0) {
      filteredResults = filters.reduce((d, f) => d.filter(f), database)
    }

    setResults(filteredResults)
  }

  useEffect(() => {
    AxiosInstance.get(`api/addresses/`)
      .then((res) => {
        setAddresses(res.data)
        const countries = res.data.map(address => address.country)
        setCountries(Array.from(new Set(countries)))
      })
      .catch((error) => console.log(error))
  }, [])

  useEffect(() => {
    setResults(database);
  }, [database]);

  return (
    <div>
      <label htmlFor="filterDropdown">Location:</label>
      <select id="location" onChange={onLocationChangeFilter} title="LocationFilter">
        <option value="all">All</option>
        {countries.map(country =>
          <option value={country}> {country} </option>
        )
        }
      </select>

      <br></br>

      <label htmlFor="filterDropdown">Pay:</label>
      <select id="pay" onChange={onPayChangeFilter} title="PayFilter">
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
      <select id="contractType" onChange={onCTChangeFilter} title="ContractFilter">
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
