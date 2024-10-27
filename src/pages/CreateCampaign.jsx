import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CreateCampaign.css'; // Import the CSS file

const CreateCampaign = () => {
  const [base64Strings, setBase64Strings] = useState([]);

  // State to manage form data
  const [formData, setFormData] = useState({
    farmerName: '',
    phoneNumber: '',
    email: '',
    farmName: '',
    farmLocation: '',
    farmSize: '',
    campaignTitle: '',
    fundingGoal: '',
    minInvestment: '',
    expectedReturns: '',
    cropTypes: '',
    farmingMethods: '',
    startDate: '',
    endDate: '',
    fundUsage: '',
    impactMetrics: '',
    visuals: [], // Change to array for multiple uploads
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    const promises = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file); // Converts image to base64 string
      });
    });

    Promise.all(promises).then((results) => {
      setBase64Strings(results); // Store base64 strings
      setFormData({ ...formData, visuals: results }); // Store the base64 strings in formData
    });
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submission

    // Prepare form data for submission
    const data = new FormData();
    // for (const key in formData) {
    //   if (key === 'visuals') {
    //     for (const file of formData.visuals) {
    //       data.append('visuals', file); // Append each file to visuals
    //     }
    //   } else {
    //     data.append(key, formData[key]);
    //   }
    // }
    
    formData.visuals = base64Strings;
    console.log(formData);
    console.log(data);
    console.log(base64Strings);
    try {
      await axios.post('http://localhost:5000/api/campaigns', formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Use multipart/form-data for file uploads
          "Authorization": `Bearer ${localStorage.getItem('token')}` // Attach token in the header
        },
      });
      alert('Campaign created!'); // Alert user on success
      // Reset the form after successful submission
      setFormData({
        farmerName: '',
        phoneNumber: '',
        email: '',
        farmName: '',
        farmLocation: '',
        farmSize: '',
        campaignTitle: '',
        fundingGoal: '',
        minInvestment: '',
        expectedReturns: '',
        cropTypes: '',
        farmingMethods: '',
        startDate: '',
        endDate: '',
        fundUsage: '',
        impactMetrics: '',
        visuals: null,
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please check your inputs.'); // User feedback on error
    }
  };


  return (
    <div className="form-container">
      <h1>Create Farm Campaign</h1>
      <form onSubmit={handleSubmit} className="campaign-form">
        {/* Farmer Information */}
        <h2>Farmer Information</h2>
        <input
          type="text"
          name="farmerName"
          placeholder="Farmer's Name"
          value={formData.farmerName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Farm Details */}
        <h2>Farm Details</h2>
        <input
          type="text"
          name="farmName"
          placeholder="Farm Name"
          value={formData.farmName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="farmLocation"
          placeholder="Farm Location"
          value={formData.farmLocation}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="farmSize"
          placeholder="Size of the Farm (acreage or square footage)"
          value={formData.farmSize}
          onChange={handleChange}
          required
        />

        {/* Campaign Information */}
        <h2>Campaign Information</h2>
        <input
          type="text"
          name="campaignTitle"
          placeholder="Campaign Title"
          value={formData.campaignTitle}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="fundingGoal"
          placeholder="Funding Goal"
          value={formData.fundingGoal}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="minInvestment"
          placeholder="Minimum Investment Amount"
          value={formData.minInvestment}
          onChange={handleChange}
          required
        />
        <textarea
          name="expectedReturns"
          placeholder="Expected Returns"
          value={formData.expectedReturns}
          onChange={handleChange}
          required
        />

        {/* Farming Practices */}
        <h2>Farming Practices</h2>
        <textarea
          name="cropTypes"
          placeholder="Crop Types"
          value={formData.cropTypes}
          onChange={handleChange}
          required
        />
        <select
          name="farmingMethods"
          value={formData.farmingMethods}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select Farming Method</option>
          <option value="Conventional">Conventional</option>
          <option value="Organic">Organic</option>
          <option value="Sustainable">Sustainable</option>
        </select>

        {/* Project Timeline */}
        <h2>Project Timeline</h2>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />

        {/* Usage of Funds */}
        <h2>Usage of Funds</h2>
        <textarea
          name="fundUsage"
          placeholder="Detailed Breakdown of Fund Usage"
          value={formData.fundUsage}
          onChange={handleChange}
          required
        />

        {/* Impact Metrics */}
        <h2>Impact Metrics</h2>
        <textarea
          name="impactMetrics"
          placeholder="Impact Metrics"
          value={formData.impactMetrics}
          onChange={handleChange}
          required
        />

        {/* Visuals */}
        <h2>Upload Visuals</h2>
        <input
          type="file"
          name="visuals"
          multiple
          onChange={handleFileChange}
        // required
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
