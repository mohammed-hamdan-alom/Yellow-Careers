import React, { useEffect, useState } from "react";
import JobSummary from "../job_summary/JobSummary";
const SearchDatabase = ({ database }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        const results = database.filter(item => item.title.toLowerCase().startsWith(query.toLowerCase()));
        setResults(results);
    };

    const handleChange = event => {
        setQuery(event.target.value);
    };

    useEffect(() => {
        setResults(database);
    }, [database]);

    return (
        <div>
            <input type="text"
                value={query}
                onChange={handleChange} />
            <button onClick={() => handleSearch(database)}>Search</button>
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

export default SearchDatabase;