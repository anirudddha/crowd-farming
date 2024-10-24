import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/CampaignDetails.css';

const CampaignDetails = () => {
  const { id } = useParams(); // Get campaign ID from URL
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState(''); // Track investment input

  // Fetch campaign details
  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/campaigns/${id}`);
        setCampaign(response.data);
      } catch (error) {
        console.error('Error fetching campaign details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetails();
  }, [id]);

  // Handle investment submission
  // Handle investment submission
const handleInvest = async (e) => {
  e.preventDefault();
  try {
    // First API call to update raised amount
    const response = await axios.put(`http://localhost:5000/api/campaigns/${id}/raisedAmount`, {
      amount: parseFloat(investmentAmount),
      userId: id, // Assuming you're passing the userId
    });

    // Second API call to store the investment details
    await axios.post(
      `http://localhost:5000/api/campaigns/${id}/investment`,
      { amount: parseFloat(investmentAmount) }, 
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Token for authentication
      }
    );

    alert('Investment successful!');
    setCampaign(response.data.campaign); // Update campaign with new raisedAmount
    setInvestmentAmount(''); // Reset input field
  } catch (error) {
    console.error('Error investing:', error);
    alert('Investment failed!');
  }
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

          {/* Investment Form */}
          <form onSubmit={handleInvest} className="investment-form">
            <input
              type="number"
              placeholder="Enter amount to invest"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              required
            />
            <button type="submit" className="invest-button">Invest Now</button>
          </form>
        </div>
      ) : (
        <p>Campaign not found.</p>
      )}
    </div>
  );
};

export default CampaignDetails;
