import React, { useEffect, useState } from "react";
import JobSearchList from "../search/JobSearchList";
import AxiosInstance from "@/utils/AxiosInstance";
import { Select } from 'antd';
import { Label } from "@/components/ui/label";

const JobFilterList = ({ data }) => {
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    pay: "all",
    contractType: "all",
    location: "all", //Location is treated as only country
  });
  const [addresses, setAddresses] = useState([]);
  const [countries, setCountries] = useState([]);


  //Return country from address id
  const getCountry = (id) => {
    if (id == undefined) {
      return "None"
    }
    const address = addresses.find(address => address.id == id)
    return address.country
  }

  const onPayChangeFilter = (e) => {
    const value = e;
    setFilters({
      ...filters,
      pay: value,
    });
    applyFilters(value, filters.contractType, filters.location);
  }

  const onCTChangeFilter = (e) => {
    const value = e;
    setFilters({
      ...filters,
      contractType: value,
    });
    applyFilters(filters.pay, value, filters.location);
  }

  const onLocationChangeFilter = (e) => {
    const value = e;
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
    let filteredResults = data;

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
      filteredResults = filters.reduce((d, f) => d.filter(f), data)
    }

    setResults(filteredResults)
  }

  //Gets unique countries from all addresses
  useEffect(() => {
    AxiosInstance.get(`api/addresses/`)
      .then((res) => {
        setAddresses(res.data)
        const countries = res.data.map(address => address.country)
        setCountries(Array.from(new Set(countries)))
      })
      .catch((error) => console.log(error))
  }, [])

  //Refreshes job list once data has been received
  useEffect(() => {
    setResults(data);
  }, [data]);

  return (
    <div>
      <Label className="text-xl m-3">Location:</Label>
      <Select id="location" className="w-80 mt-2" onChange={onLocationChangeFilter} title="LocationFilter">
        <Select.Option value="all">All</Select.Option>
        {countries.map((country, i) =>
          <Select.Option value={country} key={i}> {country} </Select.Option>
        )
        }
      </Select>

      <br></br>

      <Label className="text-xl m-3">Pay:</Label>
      <Select className="w-40 mt-2" id="pay" onChange={onPayChangeFilter} title="PayFilter">
        <Select.Option value="all">All</Select.Option>
        <Select.Option value="20000">£20,000+</Select.Option>
        <Select.Option value="25000">£25,000+</Select.Option>
        <Select.Option value="30000">£30,000+</Select.Option>
        <Select.Option value="35000">£35,000+</Select.Option>
        <Select.Option value="45000">£45,000+</Select.Option>
        <Select.Option value="100000">£100,000+</Select.Option>

      </Select>

      <br></br>

      <Label className="text-xl m-3">Job Type:</Label>
      <Select id="contractType" className="w-40 mt-2" onChange={onCTChangeFilter} title="ContractFilter">
        <Select.Option value="all">All</Select.Option>
        <Select.Option value="FT">Full-Time</Select.Option>
        <Select.Option value="PT">Part-Time</Select.Option>
        <Select.Option value="IN">Internship</Select.Option>
        <Select.Option value="TM">Temporary</Select.Option>
      </Select>

      <br></br>

      <JobSearchList data={results}></JobSearchList>
    </div>


  );
};

export default JobFilterList;
