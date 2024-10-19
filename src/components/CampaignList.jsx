import React, { useEffect, useState } from 'react';
import { getCampaigns, createCampaign, updateCampaign, deleteCampaign } from '../api/campaignApi';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Example for creating a campaign
  const handleCreateCampaign = async () => {
    const newCampaign = {
      name: "New Campaign",
      description: "Description here",
      targetAmount: 30000,
      raisedAmount: 0,
      location: "Location here",
    };

    const createdCampaign = await createCampaign(newCampaign);
    setCampaigns([...campaigns, createdCampaign]);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Campaigns</h1>
      <button onClick={handleCreateCampaign}>Add Campaign</button>
      <ul>
        {campaigns.map(campaign => (
          <li key={campaign._id}>
            <h2>{campaign.name}</h2>
            <p>{campaign.description}</p>
            <p>Target Amount: {campaign.targetAmount}</p>
            <p>Raised Amount: {campaign.raisedAmount}</p>
            <p>Location: {campaign.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignList;
