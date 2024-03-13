import React, { useState, useEffect } from 'react';

function FilterDropdown({ onChangeFilter }) {

  useEffect(() => {

  })

  return (
    <div>
      <label htmlFor="filterDropdown">Location:</label>
      <select id="filterDropdown" onChange={(e) => onChangeFilter(e.target.value)} title="Filter Dropdown">
        <option value="all">All</option>
      </select>

      <br></br>

      <label htmlFor="filterDropdown">Pay:</label>
      <select id="filterDropdown" onChange={(e) => onChangeFilter(e.target.value)} title="Filter Dropdown">
        <option value="all">All</option>
        <option value="20,000+">£20,000+</option>
        <option value="25,000+">£25,000+</option>
        <option value="30,000+">£30,000+</option>
        <option value="35,000+">£35,000+</option>
        <option value="45,000+">£45,000+</option>
        <option value="100,000+">£100,000+</option>
        
      </select>

      <br></br>

      <label htmlFor="filterDropdown">Contract Type:</label>
      <select id="filterDropdown" onChange={(e) => onChangeFilter(e.target.value)} title="Filter Dropdown">
        <option value="all">All</option>
        <option value="filter1">Filter 1</option>
        <option value="filter2">Filter 2</option>
        {/* Add more options for additional filters */}
      </select>
    </div>

    
  );
}

export default FilterDropdown;
