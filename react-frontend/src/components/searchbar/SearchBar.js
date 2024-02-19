import React, { useState } from "react";

const SearchDatabase = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

const handleSearch = (database) => {
    const results = database.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
    setResults(results);
};

const handleChange = event => {
    setQuery(event.target.value);
};

return (
    <div>
        <input type="text"
        value={query}
        onChange={handleChange} />
        <button onClick={() => handleSearch(database)}>Search</button>
        <ul>
            {results.map(item => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    </div>
);
            };

export default SearchDatabase;