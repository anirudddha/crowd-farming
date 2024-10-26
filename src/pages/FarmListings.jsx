import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
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

  // Fetch farms from the API with filters and pagination
  const fetchFarms = async (pageNum = 1) => {
    setLoading(true);
    console.log("Fetching farms for page:", pageNum, "with filters:", filters);
    
    try {
      const response = await axios.get(`http://localhost:5000/api/campaigns`, {
        params: { 
          page: pageNum, 
          limit: 10, // Adjust limit for pagination
          ...filters // Include filters in the request
        }
      });
      console.log("Response from API:", response.data);
      
      if (Array.isArray(response.data)) {
        setFarms(response.data);
      } else {
        console.warn("Expected an array but got:", response.data);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch farms when page or filters change
  useEffect(() => {
    fetchFarms(page);
  }, [page, filters]);

  // Handle changes in filter inputs
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log(`Filter changed: ${name} = ${value}`);
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // Reset page to 1 when filters change
  };

  // Navigate to the previous page
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Navigate to the next page
  const handleNextPage = async () => {
    const nextPage = page + 1;
    const response = await axios.get(`http://localhost:5000/api/campaigns`, {
      params: {
        page: nextPage,
        limit: 10, // Adjust limit for pagination
        ...filters
      }
    });

    if (response.data.length === 0) {
      toast.info("No more farms available.");
    } else {
      setPage(nextPage);
    }
  };

  return (
    <div className="farm-listings-page">
      {/* <h2 className="main-title">Explore Our Farms</h2>
      <hr className="custom-hr" /> */}
      <div className="farm-listings-container">
        <div className="filters-section">
          <h3>Filters</h3>

          <label className="filter-label" htmlFor="location">Location</label>
          <select name="location" onChange={handleFilterChange}>
            <option value="">Select Location</option>
            <option value="California">California</option>
            <option value="Texas">Texas</option>
            <option value="Florida">Florida</option>
            <option value="New York">New York</option>
            <option value="Washington">Washington</option>
          </select>

          <label className="filter-label" htmlFor="cropType">Crop Type</label>
          <select name="cropType" onChange={handleFilterChange}>
            <option value="">Select Crop Type</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Grains">Grains</option>
            <option value="Herbs">Herbs</option>
          </select>

          <label className="filter-label" htmlFor="farmingMethod">Farming Method</label>
          <select name="farmingMethod" onChange={handleFilterChange}>
            <option value="">Select Farming Method</option>
            <option value="Organic">Organic</option>
            <option value="Conventional">Conventional</option>
            <option value="Hydroponic">Hydroponic</option>
            <option value="Permaculture">Permaculture</option>
          </select>

          <label className="filter-label" htmlFor="projectNeeds">Project Needs</label>
          <select name="projectNeeds" onChange={handleFilterChange}>
            <option value="">Select Project Needs</option>
            <option value="Equipment">Equipment</option>
            <option value="Seeds">Seeds</option>
            <option value="Funding">Funding</option>
            <option value="Labor">Labor</option>
          </select>

          <label className="filter-label" htmlFor="expectedReturns">Expected Returns</label>
          <select name="expectedReturns" onChange={handleFilterChange}>
            <option value="">Select Expected Returns</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
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
