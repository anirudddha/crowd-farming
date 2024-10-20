import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CreateCampaign.css'; // Import the CSS file

const CreateCampaign = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    raisedAmount: '',
    location: '',
  });

  // Handle form input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh on form submission
  
    axios.post(
      'http://localhost:5000/api/campaigns', 
      formData, // First argument: Data to be sent
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}` // Attach token in the header
        },
      }
    )
      .then(() => {
        alert('Campaign created!'); // Alert user on success
        // Reset the form after successful submission
        setFormData({
          name: '',
          description: '',
          targetAmount: '',
          raisedAmount: '',
          location: '',
        });
      })
      .catch((error) => console.error('Error creating campaign:', error)); // Log any errors
  };
  

  return (
    <div className="form-container">
      <h1>Create Campaign</h1>
      <form onSubmit={handleSubmit} className="campaign-form">
        {/* Campaign Name */}
        <input
          type="text"
          name="name"
          placeholder="Campaign Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        {/* Campaign Description */}
        <textarea
          name="description"
          placeholder="Campaign Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        {/* Target Amount */}
        <input
          type="number"
          name="targetAmount"
          placeholder="Target Amount"
          value={formData.targetAmount}
          onChange={handleChange}
          required
        />
        {/* Raised Amount */}
        <input
          type="number"
          name="raisedAmount"
          placeholder="Raised Amount"
          value={formData.raisedAmount}
          onChange={handleChange}
        />
        {/* Location */}
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Create Campaign
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;