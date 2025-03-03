import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FarmCard from '../components/FarmCard'; // Ensure FarmCard is wrapped with React.memo
import '../styles/FarmListings.css';
import Loader from '../components/Loader';
import { 
  FiSearch, FiFilter, FiChevronDown, FiChevronLeft, FiChevronRight 
} from 'react-icons/fi';

const FarmListings = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Separately track filter inputs and applied filters
  const [filterInputs, setFilterInputs] = useState({
    farmLocation: '',
    cropTypes: '',
    farmingMethods: '',
    projectNeeds: '',
    expectedReturns: '',
  });

  const [appliedFilters, setAppliedFilters] = useState({
    farmLocation: '',
    cropTypes: '',
    farmingMethods: '',
    projectNeeds: '',
    expectedReturns: '',
  });

  const [filterOptions, setFilterOptions] = useState({
    farmLocation: [],
    cropTypes: [],
    farmingMethods: [],
    projectNeeds: [],
    expectedReturns: [],
  });

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
          projectNeeds: [],
          expectedReturns: [],
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
      const response = await axios.get(`http://localhost:5000/api/campaigns`, {
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
  }, [appliedFilters, cacheKey]);

  useEffect(() => {
    fetchFarms(page);
  }, [page, appliedFilters, fetchFarms]);

  const fetchAllOptions = useCallback(async (field) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/campaigns/filters/options`, {
        params: { field },
      });
      setFilterOptions((prev) => ({ ...prev, [field]: response.data }));
    } catch (error) {
      console.error(`Error fetching all options for ${field}:`, error);
    }
  }, []);

  const handleInputChange = useCallback(
    async (e) => {
      const { name, value } = e.target;
      setFilterInputs((prev) => ({ ...prev, [name]: value }));

      if (value) {
        try {
          const response = await axios.get(`http://localhost:5000/api/campaigns/filters/options`, {
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
    [fetchAllOptions]
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
      const response = await axios.get(`http://localhost:5000/api/campaigns`, {
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
  }, [page, appliedFilters]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Section */}
        <div ref={filtersContainerRef} className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6 h-fit lg:sticky lg:top-6">
          <div className="flex items-center gap-2 mb-6">
            <FiFilter className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          {Object.keys(filterInputs).map((filterKey) => (
            <div key={filterKey} className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {filterKey.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </label>
              <div className="relative">
                <input
                  name={filterKey}
                  value={filterInputs[filterKey]}
                  onChange={handleInputChange}
                  placeholder={`Search ${filterKey.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}
                  onFocus={() => fetchAllOptions(filterKey)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
                <FiChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              {filterOptions[filterKey].length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filterOptions[filterKey].map((option) => (
                    <li
                      key={option}
                      onClick={() => handleSelectOption(filterKey, option)}
                      className="px-4 py-2.5 hover:bg-emerald-50 cursor-pointer text-sm text-gray-700 transition-colors"
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <button
            onClick={applyFilters}
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <FiSearch className="w-5 h-5" />
            Apply Filters
          </button>
        </div>

        {/* Farms Listing */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loader />
            </div>
          ) : farms.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {farms.map((farm) => (
                  <FarmCard key={farm._id} farm={farm} />
                ))}
              </div>
              <div className="mt-8 flex items-center justify-end gap-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    page === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  } transition-all flex items-center gap-2`}
                >
                  <FiChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                <span className="text-gray-600 font-medium">Page {page}</span>
                <button
                  onClick={handleNextPage}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  Next
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="text-6xl text-gray-300 mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No farms found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        theme="colored"
      />
    </div>
  );
};

export default FarmListings;
