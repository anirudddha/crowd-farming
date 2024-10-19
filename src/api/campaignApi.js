import axios from 'axios';

const API_URL = 'http://localhost:5000/api/campaigns'; // Update this URL if your backend is hosted differently

// Get all campaigns
export const getCampaigns = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create a new campaign
export const createCampaign = async (campaignData) => {
  const response = await axios.post(API_URL, campaignData);
  return response.data;
};

// Update a campaign
export const updateCampaign = async (id, campaignData) => {
  const response = await axios.put(`${API_URL}/${id}`, campaignData);
  return response.data;
};

// Delete a campaign
export const deleteCampaign = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
