import React, { useEffect, useState } from "react";
import JobSummary from "../summary/JobSummary";
import FilterDropdown from "./JobFilter";

const JobSearchBar = ({ database }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = (e) => {
        const query = e.target.value
        setQuery(query)
        const results = database.filter(item => item.title
            .split(" ").find(size => size.toLowerCase().startsWith(query.toLowerCase())))
        const moreResults = database.filter(item => item.title
            .toLowerCase().startsWith(query.toLowerCase()))
        const actualResults = [...new Set([...results, ...moreResults])]
        setResults(actualResults)
    };

    useEffect(() => {
        setResults(database);
    }, [database]);

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

export default JobSearchBar;