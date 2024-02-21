import React, { useEffect, useState } from "react";
import JobSummary from "../job_summary/JobSummary";
const SearchBar = ({ database }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = (e) => {
        const query = e.target.value
        setQuery(query)
        const results = database.filter(item => item.title.toLowerCase().startsWith(query.toLowerCase()));
        setResults(results);
    };

    useEffect(() => {
        setResults(database);
    }, [database]);

    return (
        <div>
            <input type="text"
                value={query}
                onChange={handleSearch} />
            <ul>
                <ul className='job-summary'>
                    {results.map(job => (
                        <JobSummary
                            key={job.id}
                            id={job.id}
                            title={job.title}
                            hirer={job.hirer}
                            description={job.description}
                            location={job.address}
                        />
                    ))}
                </ul>
            </ul>
        </div>
    );
};

export default SearchBar;