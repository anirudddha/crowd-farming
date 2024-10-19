import React, { useState } from 'react';

const CampaignForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Campaign Data:', formData);
    // Submit campaign data to API
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Campaign Name" onChange={handleChange} />
      <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
      <input type="number" name="targetAmount" placeholder="Target Amount" onChange={handleChange} />
      <input type="text" name="location" placeholder="Location" onChange={handleChange} />
      <button type="submit">Create Campaign</button>
    </form>
  );
};

export default CampaignForm;
