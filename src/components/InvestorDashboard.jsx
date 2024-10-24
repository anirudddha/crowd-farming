import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css'; // Reuse same CSS for campaigns and investments

const InvestorDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    const fetchCampaignsAndInvestments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user-campaigns', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCampaigns(response.data.campaigns);
        setInvestments(response.data.investments);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCampaignsAndInvestments();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Investor Dashboard</h2>

      {/* Campaigns Section */}
      <h3 className="campaign-heading">Your Campaigns:</h3>
      {campaigns.length > 0 ? (
        <ul className="campaign-list">
          {campaigns.map((campaign) => (
            <li key={campaign._id} className="campaign-card">
              <h4 className="campaign-name">{campaign.name}</h4>
              <p className="campaign-description">{campaign.description}</p>
              <div className="campaign-details">
                <span>🎯 Target: ${campaign.targetAmount}</span>
                <span>💰 Raised: ${campaign.raisedAmount}</span>
                <span>📍 Location: {campaign.location}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-campaigns">No campaigns found.</p>
      )}

      {/* Investments Section */}
      <h3 className="investment-heading">Your Investments:</h3>
      {investments.length > 0 ? (
        <ul className="investment-list">
          {investments.map((investment) => (
            <li key={investment._id} className="investment-card">
              <h4 className="investment-farm">Farm: {investment.campaignId.name}</h4>
              <div className="investment-details">
                <span className="investment-amount">Amount: ${investment.amount}</span>
                <span className="investment-date">Date: {new Date(investment.date).toLocaleDateString()}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-investments">No investments found.</p>
      )}
    </div>
  );
};

export default InvestorDashboard;
