// File: components/SearchBar.js
import { useState, useEffect } from 'react';

export default function SearchBar({ filters, setFilters }) {
  const [searchQuery, setSearchQuery] = useState(filters.search);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ ...filters, search: searchQuery });
    }, 500); // 500ms debounce delay

    return () => clearTimeout(debounceTimer); // Clear the debounce timer on cleanup
  }, [searchQuery, filters, setFilters]);

  return (
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search documents..."
        className="w-full border border-gray-300 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
      />
      {searchQuery && (
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          onClick={() => setSearchQuery('')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
