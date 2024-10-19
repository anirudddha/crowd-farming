import React, { useState } from 'react';
import axios from 'axios';

const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    raisedAmount: '', // Add raisedAmount to state
    location: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make sure to send all required fields, including raisedAmount
    axios.post('http://localhost:5000/api/campaigns', formData)
      .then((response) => {
        alert('Campaign created!');
        setFormData({ name: '', description: '', targetAmount: '', raisedAmount: '', location: '' }); // Reset form
      })
      .catch((error) => console.error('Error creating campaign:', error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      ></textarea>
      <input
        type="number"
        name="targetAmount"
        placeholder="Target Amount"
        value={formData.targetAmount}
        onChange={handleChange}
      />
      <input
        type="number" // Change to number for raisedAmount
        name="raisedAmount"
        placeholder="Raised Amount" // Placeholder for raisedAmount
        value={formData.raisedAmount} // Bind the raisedAmount state
        onChange={handleChange}
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
      />
      <button type="submit">Create Campaign</button>
    </form>
  );
};

export default CreateCampaign;
