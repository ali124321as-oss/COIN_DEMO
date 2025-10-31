import React, { useState, useEffect } from "react";

const SearchBar = ({ 
  filterCoinBySearchedValue, 
  placeholder, 
  searchedValue,
  setSearchedValue,
  sortBy,
  onSort,
  hasSearched,
  isLoading 
}) => {

  const [timeoutId, setTimeoutId] = useState(null);

  const handleFilter = (value) => {
    if (value.trim().length > 0) {
      filterCoinBySearchedValue(value.trim());
      console.log("Filtering with:", value.trim());
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setSearchedValue(val); // Update UI immediately
    
    if (timeoutId) clearTimeout(timeoutId);

    const newTimeoutId = setTimeout(() => {
      handleFilter(val); // Filter after delay only if length > 0
    }, 500);
    
    setTimeoutId(newTimeoutId);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Clear any pending timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
      // Trigger filter immediately on Enter
      handleFilter(searchedValue);
      console.log("Enter pressed - immediate filter");
    }
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    onSort(value); // Call onSort for all values including "none"
  };

  // Clean up timer when unmounted
  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center justify-center mt-6 mb-4 mx-auto max-w-[1200px] w-full px-4 sm:px-6">
      {/* Search Input */}
      <div className="flex-1 w-full max-w-2xl">
        <input
          type="text"
          value={searchedValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown} 
          placeholder={placeholder || "Search..."}
          className="border border-gray-300 bg-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
        />
      </div>

      {/* Sort Dropdown - Hidden when searching */}
      {!hasSearched && (
        <div className="w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={handleSortChange}
            disabled={isLoading}
            className="border border-gray-300 bg-white px-4 py-3 rounded-lg w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Sort by...</option>
            <option value="price">Sort by Price</option>
            <option value="volume">Sort by Volume</option>
            <option value="market_cap">Sort by Market Cap</option>
            <option value="none">Reset all filters</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchBar;