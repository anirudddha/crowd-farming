import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FarmCard from '../../components/FarmCard';
import '../../styles/FarmListings.css';
import Loader from '../../components/Loader';
import { 
  FiSearch, FiFilter, FiChevronDown, FiChevronLeft, FiChevronRight 
} from 'react-icons/fi';
import { useSelector } from 'react-redux';

const FarmListings = () => {
  const endpoint = useSelector(state=> state.endpoint.endpoint);

  // Removed projectNeeds and expectedReturns from the filters
  const [filterInputs, setFilterInputs] = useState({
    farmLocation: '',
    cropTypes: '',
    farmingMethods: '',
  });

  const [appliedFilters, setAppliedFilters] = useState({
    farmLocation: '',
    cropTypes: '',
    farmingMethods: '',
  });

  const [filterOptions, setFilterOptions] = useState({
    farmLocation: [],
    cropTypes: [],
    farmingMethods: [],
  });

  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Ref for the entire filters container
  const filtersContainerRef = useRef(null);

  // Global click listener to clear all dropdowns if click is outside filters container
  useEffect(() => {
    const handleClickOutsideFilters = (e) => {
      if (filtersContainerRef.current && !filtersContainerRef.current.contains(e.target)) {
        setFilterOptions({
          farmLocation: [],
          cropTypes: [],
          farmingMethods: [],
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutsideFilters);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideFilters);
    };
  }, []);

  // Create a cache key that depends on page and appliedFilters
  const cacheKey = useMemo(() => {
    return `farms_${page}_${JSON.stringify(appliedFilters)}`;
  }, [page, appliedFilters]);

  const fetchFarms = useCallback(async (pageNum = 1) => {
    setLoading(true);
    // Try to get cached data first
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      setFarms(JSON.parse(cachedData));
      setLoading(false);
    }
    try {
      const response = await axios.get(`${endpoint}/campaigns`, {
        params: {
          page: pageNum,
          limit: 10,
          ...appliedFilters,
        },
      });
      const data = Array.isArray(response.data) ? response.data : [];
      setFarms(data);
      // Update the cache with fresh data
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, cacheKey, endpoint]);

  useEffect(() => {
    fetchFarms(page);
  }, [page, appliedFilters, fetchFarms]);

  const fetchAllOptions = useCallback(async (field) => {
    try {
      const response = await axios.get(`${endpoint}/campaigns/filters/options`, {
        params: { field },
      });
      setFilterOptions((prev) => ({ ...prev, [field]: response.data }));
    } catch (error) {
      console.error(`Error fetching all options for ${field}:`, error);
    }
  }, [endpoint]);

  const handleInputChange = useCallback(
    async (e) => {
      const { name, value } = e.target;
      setFilterInputs((prev) => ({ ...prev, [name]: value }));

      if (value) {
        try {
          const response = await axios.get(`${endpoint}/campaigns/filters/options`, {
            params: { field: name, term: value },
          });
          setFilterOptions((prev) => ({ ...prev, [name]: response.data }));
        } catch (error) {
          console.error(`Error fetching ${name} options:`, error);
        }
      } else {
        await fetchAllOptions(name);
      }
    },
    [fetchAllOptions, endpoint]
  );

  const handleSelectOption = useCallback((name, value) => {
    setFilterInputs((prev) => ({ ...prev, [name]: value }));
    // Clear options after selection for that filter
    setFilterOptions((prev) => ({ ...prev, [name]: [] }));
  }, []);

  const applyFilters = useCallback(() => {
    setAppliedFilters(filterInputs);
    setPage(1); // Reset page to 1 when applying new filters
  }, [filterInputs]);

  const handlePreviousPage = useCallback(() => {
    if (page > 1) setPage((prev) => prev - 1);
  }, [page]);

  const handleNextPage = useCallback(async () => {
    const nextPage = page + 1;
    try {
      const response = await axios.get(`${endpoint}/campaigns`, {
        params: {
          page: nextPage,
          limit: 10,
          ...appliedFilters,
        },
      });
      if (response.data.length === 0) {
        toast.info("No more farms available.");
      } else {
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error fetching next page:", error);
    }
  }, [page, appliedFilters, endpoint]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agricultural Investment Opportunities</h1>
          <div className="flex items-center text-sm text-gray-500">
            <span>Showing {farms.length} results</span>
            <span className="mx-2">•</span>
            <div className="flex items-center">
              <span className="mr-2">Sorted by:</span>
              <select className="bg-transparent border-0 text-gray-700 font-medium">
                <option>Newest First</option>
                <option>Funding Progress</option>
                <option>Return Potential</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div ref={filtersContainerRef} className="mb-8 border-b border-gray-200 pb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {Object.keys(filterInputs).map((filterKey) => (
              <div key={filterKey} className="relative">
                <div className="relative w-48">
                  <input
                    name={filterKey}
                    value={filterInputs[filterKey]}
                    onChange={handleInputChange}
                    placeholder={filterKey.replace(/([A-Z])/g, ' $1')}
                    onFocus={() => fetchAllOptions(filterKey)}
                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-600 focus:border-green-600 outline-none"
                  />
                  <FiChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  {filterOptions[filterKey].length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                      {filterOptions[filterKey].map((option) => (
                        <div
                          key={option}
                          onClick={() => handleSelectOption(filterKey, option)}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={applyFilters}
              className="ml-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center"
            >
              <FiSearch className="mr-2" />
              Apply Filters
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
                <div className="h-48 bg-gray-100 rounded-lg mb-4" />
                <div className="h-4 bg-gray-100 rounded mb-3 w-3/4" />
                <div className="h-4 bg-gray-100 rounded mb-3 w-1/2" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : farms.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {farms.map((farm) => (
                <FarmCard 
                  key={farm._id}
                  farm={farm}
                  className="border border-gray-200 hover:border-green-100 hover:shadow-lg transition-all rounded-xl overflow-hidden"
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex items-center justify-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`p-2.5 rounded-lg ${
                  page === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100'
                } transition-colors border border-gray-200`}
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-1">
                <span className="px-3 py-2 text-sm text-gray-600">Page {page}</span>
              </div>
              <button
                onClick={handleNextPage}
                className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6 text-green-600">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No matching results</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search parameters</p>
            <button
              onClick={() => setAppliedFilters({})}
              className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        theme="colored"
        toastClassName="rounded-lg border border-gray-200"
      />
    </div>
  );
};

export default FarmListings;