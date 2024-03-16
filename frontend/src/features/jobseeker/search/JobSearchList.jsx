import React, { useEffect, useState } from "react";
import JobSummary from "../summary/JobSummary";
import FilterDropdown from "./JobFilterList";
import AxiosInstance from "@/utils/AxiosInstance";

const JobSearchList = ({ data }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = (e) => {
        const query = e.target.value
        setQuery(query)
        const filteredResults = data.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
        setResults(filteredResults);
    };

    useEffect(() => {
        setResults(data);
    }, [data]);

    return (
        <>
            <input className="form-control" type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search Jobs"
            />
            {
                results.map(job => (
                    < ul key={job.id} >
                        <JobSummary job={job} />
                    </ul>))
            }
        </>


    );
};

export default JobSearchList;