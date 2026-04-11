import React, { useState } from "react";

export default function FilterBar({ filters = [], onFilter }) {
  const [selectedFilter, setSelectedFilter] = useState("");

  const handleApply = () => {
    onFilter(selectedFilter);
  };

  const handleClear = () => {
    setSelectedFilter("");
    onFilter(""); // reset filter
  };

  return (
    <div className="filter-bar">
      <div className="filter-controls">
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Payment Types</option>
          {filters.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>

        <button
          className="apply-btn"
          disabled={!selectedFilter}
          onClick={handleApply}
        >
          Apply
        </button>

        <button className="cancel-btn" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  );
}