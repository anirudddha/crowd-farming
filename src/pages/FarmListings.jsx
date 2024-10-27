import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FarmCard from '../components/FarmCard';
import '../styles/FarmListings.css';

const FarmListings = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    location: '',
    cropType: '',
    farmingMethod: '',
    projectNeeds: '',
    expectedReturns: '',
  });

  const [filterOptions, setFilterOptions] = useState({
    location: [],
    cropType: [],
    farmingMethod: [],
    projectNeeds: [],
    expectedReturns: [],
  });

  const fetchFarms = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/campaigns`, {
        params: {
          page: pageNum,
          limit: 10,
          ...filters,
        },
      });
      setFarms(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms(page);
  }, [page, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log(`Filter changed: ${name} = ${value}`);
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // Reset page to 1 when filters change
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    if (value) {
      try {
        const response = await axios.get(`http://localhost:5000/api/campaigns/filters/options`, {
          params: { field: name, term: value },
        });

        console.log(`Options fetched for ${name}:`, response.data); // Log response data

        setFilterOptions((prev) => ({ ...prev, [name]: response.data }));
      } catch (error) {
        console.error(`Error fetching ${name} options:`, error);
      }
    } else {
      setFilterOptions((prev) => ({ ...prev, [name]: [] }));
    }
  };

  const handleSelectOption = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setFilterOptions((prev) => ({ ...prev, [name]: [] })); // Clear options after selection
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = async () => {
    const nextPage = page + 1;
    const response = await axios.get(`http://localhost:5000/api/campaigns`, {
      params: {
        page: nextPage,
        limit: 10,
        ...filters,
      },
    });

    if (response.data.length === 0) {
      toast.info("No more farms available.");
    } else {
      setPage(nextPage);
    }
  };

  return (
    <div className="farm-listings-page">
      <div className="farm-listings-container">
        <div className="filters-section">
          <h3>Filters</h3>

          <label className="filter-label" htmlFor="location">Location</label>
          <input
            name="location"
            value={filters.location}
            onChange={handleInputChange}
            placeholder="Search Location"
          />
          {filterOptions.location.length > 0 && (
            <ul className="suggestions">
              {filterOptions.location.map((option) => (
                <li key={option} onClick={() => handleSelectOption('location', option)}>
                  {option}
                </li>
              ))}
            </ul>
          )}

          <label className="filter-label" htmlFor="cropType">Crop Type</label>
          <input
            name="cropType"
            value={filters.cropType}
            onChange={handleInputChange}
            placeholder="Search Crop Type"
          />
          {filterOptions.cropType.length > 0 && (
            <ul className="suggestions">
              {filterOptions.cropType.map((option) => (
                <li key={option} onClick={() => handleSelectOption('cropType', option)}>
                  {option}
                </li>
              ))}
            </ul>
          )}

          <label className="filter-label" htmlFor="farmingMethod">Farming Method</label>
          <input
            name="farmingMethod"
            value={filters.farmingMethod}
            onChange={handleInputChange}
            placeholder="Search Farming Method"
          />
          {filterOptions.farmingMethod.length > 0 && (
            <ul className="suggestions">
              {filterOptions.farmingMethod.map((option) => (
                <li key={option} onClick={() => handleSelectOption('farmingMethod', option)}>
                  {option}
                </li>
              ))}
            </ul>
          )}

          <label className="filter-label" htmlFor="projectNeeds">Project Needs</label>
          <input
            name="projectNeeds"
            value={filters.projectNeeds}
            onChange={handleInputChange}
            placeholder="Search Project Needs"
          />
          {filterOptions.projectNeeds.length > 0 && (
            <ul className="suggestions">
              {filterOptions.projectNeeds.map((option) => (
                <li key={option} onClick={() => handleSelectOption('projectNeeds', option)}>
                  {option}
                </li>
              ))}
            </ul>
          )}

          <label className="filter-label" htmlFor="expectedReturns">Expected Returns</label>
          <input
            name="expectedReturns"
            value={filters.expectedReturns}
            onChange={handleInputChange}
            placeholder="Search Expected Returns"
          />
          {filterOptions.expectedReturns.length > 0 && (
            <ul className="suggestions">
              {filterOptions.expectedReturns.map((option) => (
                <li key={option} onClick={() => handleSelectOption('expectedReturns', option)}>
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="farms-listing">
          {loading ? (
            <p>Loading...</p>
          ) : farms.length > 0 ? (
            <div className="farms-grid">
              {farms.map((farm) => (
                <FarmCard key={farm._id} farm={farm} />
              ))}
            </div>
          ) : (
            <p>No farms found</p>
          )}

          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={page === 1}>
              Previous
            </button>
            <button onClick={handleNextPage}>Next</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FarmListings;
