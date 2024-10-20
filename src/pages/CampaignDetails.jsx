import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/CampaignDetails.css'; // Import CSS file

const CampaignDetails = () => {
  const { id } = useParams(); // Get campaign ID from URL params
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch campaign details when component mounts
  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        console.log(id);
        const response = await axios.get(`http://localhost:5000/api/campaigns/${id}`);
        console.log(response);
        setCampaign(response.data);
      } catch (error) {
        console.error('Error fetching campaign details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [id]);

  // Handle Invest button click
  const handleInvest = () => {
    alert('Thank you for your investment!');
    // Here you can implement investment logic (e.g., open a payment page)
  };

  return (
    <div className="campaign-details-container">
      {loading ? (
        <p>Loading...</p>
      ) : campaign ? (
        <div className="campaign-details-card">
          <h2>{campaign.name}</h2>
          <p>{campaign.description}</p>
          <div className="campaign-info">
            <p><strong>Target Amount:</strong> ${campaign.targetAmount}</p>
            <p><strong>Raised Amount:</strong> ${campaign.raisedAmount}</p>
            <p><strong>Location:</strong> {campaign.location}</p>
          </div>
          <button className="invest-button" onClick={handleInvest}>Invest Now</button>
        </div>
      ) : (
        <p>Campaign not found.</p>
      )}
    </div>
  );
};

export default CampaignDetails;
