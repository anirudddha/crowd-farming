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

  const fetchFarms = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/campaigns`, {
        params: {
          page: pageNum,
          limit: 10,
          ...appliedFilters,
        },
      });
      setFarms(Array.isArray(response.data) ? response.data : []);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms(page);
  }, [page, appliedFilters]);

  const handleFilterInputChange = (e) => {
    const { name, value } = e.target;
    setFilterInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFilterInputs((prev) => ({ ...prev, [name]: value }));

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
    setFilterInputs((prev) => ({ ...prev, [name]: value }));
    setFilterOptions((prev) => ({ ...prev, [name]: [] })); // Clear options after selection
  };

  const applyFilters = () => {
    setAppliedFilters(filterInputs);
    setPage(1); // Reset page to 1 when applying new filters
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
        ...appliedFilters,
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
          <h3>FILTERS</h3>
          <hr className="custom-hr" />
          <label className="filter-label" htmlFor="location">Location</label>
          <input
            name="farmLocation"
            value={filterInputs.farmLocation}
            onChange={handleInputChange}
            placeholder="Search Location"
          />
          {filterOptions.farmLocation.length > 0 && (
            <ul className="suggestions">
              {filterOptions.farmLocation.map((option) => (
                <li key={option} onClick={() => handleSelectOption('farmLocation', option)}>
                  {option}
                </li>
              ))}
            </ul>
          )}

          <label className="filter-label" htmlFor="cropType">Crop Type</label>
          <input
            name="cropTypes"
            value={filterInputs.cropTypes}
            onChange={handleInputChange}
            placeholder="Search Crop Type"
          />
          {filterOptions.cropTypes.length > 0 && (
            <ul className="suggestions">
              {filterOptions.cropTypes.map((option) => (
                <li key={option} onClick={() => handleSelectOption('cropTypes', option)}>
                  {option}
                </li>
              ))}
            </ul>
          )}

          <label className="filter-label" htmlFor="farmingMethods">Farming Method</label>
          <input
            name="farmingMethods"
            value={filterInputs.farmingMethods}
            onChange={handleInputChange}
            placeholder="Search Farming Method"
          />
          {filterOptions.farmingMethods.length > 0 && (
            <ul className="suggestions">
              {filterOptions.farmingMethods.map((option) => (
                <li key={option} onClick={() => handleSelectOption('farmingMethods', option)}>
                  {option}
                </li>
              ))}
            </ul>
          )}

          <label className="filter-label" htmlFor="projectNeeds">Project Needs</label>
          <input
            name="projectNeeds"
            value={filterInputs.projectNeeds}
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
            value={filterInputs.expectedReturns}
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

          <button onClick={applyFilters} className="apply-filters-button">
            Apply Filters
          </button>
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
