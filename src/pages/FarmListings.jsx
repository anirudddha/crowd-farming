import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FarmCard from '../components/FarmCard';

const FarmListings = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/campaigns'); // Adjust URL if needed
        console.log('Fetched data:', response.data);
        setFarms(response.data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  return (
    <div>
      <h2>Farm Listings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : farms.length > 0 ? (
        farms.map((farm) => <FarmCard key={farm._id} farm={farm} />)
      ) : (
        <p>No farms available.</p>
      )}
    </div>
  );
};

export default FarmListings;
