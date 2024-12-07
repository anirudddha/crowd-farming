import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InvestorDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [modalType, setModalType] = useState(''); // 'view' or 'edit'
  const [editedCampaign, setEditedCampaign] = useState(null);

  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user-campaigns', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCampaigns(response.data.campaigns);
        setInvestments(response.data.investments);
        console.log(investments);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchCampaigns();
  }, []);

  const handleDeleteCampaign = async (id) => {
    try {
      await axios.delete('http://localhost:5000/api/campaigns/deleteCampaign', {
        data: { id },
      });
      setCampaigns(campaigns.filter((campaign) => campaign._id !== id));
    } catch (error) {
      console.error('Error Deleting data:', error);
    }
  };

  const openModal = (campaign, type) => {
    setSelectedCampaign(campaign);
    setEditedCampaign({ ...campaign });
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedCampaign(null);
    setModalType('');
  };

  const handleEditChange = (e) => {
    setEditedCampaign({ ...editedCampaign, [e.target.name]: e.target.value });
  };

  const saveEdits = async () => {
    try {
      await axios.put(`http://localhost:5000/api/campaigns/editCampaign`, editedCampaign);
      setCampaigns(campaigns.map((campaign) =>
        campaign._id === editedCampaign._id ? editedCampaign : campaign
      ));
      closeModal();
      toast.info("Your information is updated");
    } catch (error) {
      console.error('Error saving edits:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Investor Dashboard</h2>

      <h3 className="campaign-heading">Your Campaigns:</h3>
      {campaigns.length > 0 ? (
        <ul className="campaign-list">
          {campaigns.map((campaign) => (
            <li key={campaign._id} className="campaign-card">
              <h4 className="campaign-name">{campaign.campaignTitle}</h4>
              <p className="campaign-description">{campaign.impactMetrics}</p>
              <div className="campaign-details">
                <span>🎯 Target: ${campaign.fundingGoal}</span>
                <span>💰 Raised: ${campaign.raisedAmount}</span>
                <span>📍 Location: {campaign.farmLocation}</span>
              </div>
              <div className="card-buttons">
                <button className="button-primary" onClick={() => openModal(campaign, 'view')}>
                  View
                </button>
                <button className="button-primary" onClick={() => openModal(campaign, 'edit')}>
                  Edit
                </button>
                <button
                  className="button-delete"
                  onClick={() => handleDeleteCampaign(campaign._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-campaigns">No campaigns found.</p>
      )}

      {selectedCampaign && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>
              ✖
            </button>
            <h3>{modalType === 'view' ? 'View Campaign Details' : 'Edit Campaign Details'}</h3>
            <div className="modal-body">
              {modalType === 'view' ? (
                <div className="view-content">
                  <p><strong>Farmer Name:</strong>{selectedCampaign.farmerName}</p>
                  <p><strong>Phone Number:</strong> {selectedCampaign.phoneNumber}</p>
                  <p><strong>Email:</strong> {selectedCampaign.email}</p>
                  <p><strong>Farm Name:</strong> {selectedCampaign.farmName}</p>
                  <p><strong>Location:</strong> {selectedCampaign.farmLocation}</p>
                  {/* Visuals */}
                  <div className="edit-field">
                    <label htmlFor="visuals">Visuals</label>
                    <div className="visuals-container">
                      {editedCampaign.visuals && editedCampaign.visuals.length > 0 ? (
                        editedCampaign.visuals.map((visual, index) => {
                          // Check if the visual is a base64 string (assuming base64 strings are image data)
                          const isBase64 = visual.startsWith('data:image');

                          return isBase64 ? (
                            <div key={index} className="visual-image">
                              <img src={visual} alt={`visual-${index}`} className="visual-image" />
                            </div>
                          ) : (
                            <div key={index} className="visual-text">
                              <textarea
                                id="visuals"
                                name="visuals"
                                value={editedCampaign.visuals.join(', ')}
                                onChange={handleEditChange}
                              />
                            </div>
                          );
                        })
                      ) : (
                        <p>No visuals available</p>
                      )}
                    </div>
                  </div>
                  <p><strong>Farm Size:</strong> {selectedCampaign.farmSize}</p>
                  <p><strong>Campaign Title:</strong> {selectedCampaign.campaignTitle}</p>
                  <p><strong>Funding Goal:</strong> ${selectedCampaign.fundingGoal}</p>
                  <p><strong>Minimum Investment:</strong> ${selectedCampaign.minInvestment}</p>
                  <p><strong>Expected Returns:</strong> {selectedCampaign.expectedReturns}</p>
                  <p><strong>Crop Types:</strong> {selectedCampaign.cropTypes}</p>
                  <p><strong>Farming Methods:</strong> {selectedCampaign.farmingMethods}</p>
                  <p><strong>Start Date:</strong> {new Date(selectedCampaign.startDate).toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {new Date(selectedCampaign.endDate).toLocaleDateString()}</p>
                  <p><strong>Fund Usage:</strong> {selectedCampaign.fundUsage}</p>
                  <p><strong>Impact Metrics:</strong> {selectedCampaign.impactMetrics}</p>

                </div>
              ) : (
                <div className="edit-content">
                  {/* Farmer Name */}
                  <div className="edit-field">
                    <label htmlFor="farmerName">Farmer Name</label>
                    <input
                      id="farmerName"
                      name="farmerName"
                      type="text"
                      value={editedCampaign.farmerName}
                      onChange={handleEditChange}
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="edit-field">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="text"
                      value={editedCampaign.phoneNumber}
                      onChange={handleEditChange}
                    />
                  </div>

                  {/* Email */}
                  <div className="edit-field">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={editedCampaign.email}
                      onChange={handleEditChange}
                    />
                  </div>

                  {/* Farm Name */}
                  <div className="edit-field">
                    <label htmlFor="farmName">Farm Name</label>
                    <input
                      id="farmName"
                      name="farmName"
                      type="text"
                      value={editedCampaign.farmName}
                      onChange={handleEditChange}
                    />
                  </div>

                  {/* Farm Location */}
                  <div className="edit-field">
                    <label htmlFor="farmLocation">Farm Location</label>
                    <input
                      id="farmLocation"
                      name="farmLocation"
                      type="text"
                      value={editedCampaign.farmLocation}
                      onChange={handleEditChange}
                    />
                  </div>

                  {/* Farm Size */}
                  <div className="edit-field">
                    <label htmlFor="farmSize">Farm Size</label>
                    <input
                      id="farmSize"
                      name="farmSize"
                      type="text"
                      value={editedCampaign.farmSize}
                      onChange={handleEditChange}
                    />
                  </div>

                  {/* Campaign Title */}
                  <div className="edit-field">
                    <label htmlFor="campaignTitle">Campaign Title</label>
                    <input
                      id="campaignTitle"
                      name="campaignTitle"
                      type="text"
                      value={editedCampaign.campaignTitle}
                      onChange={handleEditChange}
                    />
                  </div>

                  {/* Funding Goal */}
                  <div className="edit-field">
                    <label htmlFor="fundingGoal">Funding Goal</label>
                    <input
                      id="fundingGoal"
                      name="fundingGoal"
                      type="number"
                      value={editedCampaign.fundingGoal}
                      onChange={handleEditChange}
                    />
                  </div>

                  {/* Minimum Investment */}
                  <div className="edit-field">
                    <label htmlFor="minInvestment">Minimum Investment</label>
                    <input
                      id="minInvestment"
                      name="minInvestment"
                      type="number"
                      value={editedCampaign.minInvestment}
                      onChange={handleEditChange}
                    />
                  </div>

                  {/* Expected Returns */}
                  <div className="edit-field">
                    <label htmlFor="expectedReturns">Expected Returns</label>
                    <input
                      id="expectedReturns"
                      name="expectedReturns"
                      type="text"
                      value={editedCampaign.expectedReturns}
                      onChange={handleEditChange}
                    />
                  </div>

                  {/* Crop Types */}
                  <div className="edit-field">
                    <label htmlFor="cropTypes">Crop Types</label>
                    <input
                      id="cropTypes"
                      name="cropTypes"
                      type="text"
                      value={editedCampaign.cropTypes}
                      onChange={handleEditChange}
                    />
                  </div>

                  {/* Farming Methods */}
                  <div className="edit-field">
                    <label htmlFor="farmingMethods">Farming Methods</label>
                    <input
                      id="farmingMethods"
                      name="farmingMethods"
                      type="text"
                      value={editedCampaign.farmingMethods}
                      onChange={handleEditChange}
                    />
                  </div>

                  {/* Start Date */}
                  <div className="edit-field">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={editedCampaign.startDate.split('T')[0]} // Format for date picker
                      onChange={handleEditChange}
                    />
                  </div>

                  {/* End Date */}
                  <div className="edit-field">
                    <label htmlFor="endDate">End Date</label>
                    <input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={editedCampaign.endDate.split('T')[0]} // Format for date picker
                      onChange={handleEditChange}
                    />
                  </div>

                  {/* Fund Usage */}
                  <div className="edit-field">
                    <label htmlFor="fundUsage">Fund Usage</label>
                    <textarea
                      id="fundUsage"
                      name="fundUsage"
                      value={editedCampaign.fundUsage}
                      onChange={handleEditChange}
                    />
                  </div>

                  {/* Impact Metrics */}
                  <div className="edit-field">
                    <label htmlFor="impactMetrics">Impact Metrics</label>
                    <textarea
                      id="impactMetrics"
                      name="impactMetrics"
                      value={editedCampaign.impactMetrics}
                      onChange={handleEditChange}
                    />
                  </div>

                  {/* Raised Amount */}
                  <div className="edit-field">
                    <label htmlFor="raisedAmount">Raised Amount</label>
                    <input
                      id="raisedAmount"
                      name="raisedAmount"
                      type="number"
                      value={editedCampaign.raisedAmount}
                      onChange={handleEditChange}
                      disabled
                    />
                  </div>

                  {/* Visuals */}
                  <div className="edit-field">
                    <label htmlFor="visuals">Visuals</label>
                    <div className="visuals-container">
                      {editedCampaign.visuals && editedCampaign.visuals.length > 0 ? (
                        editedCampaign.visuals.map((visual, index) => {
                          // Check if the visual is a base64 string (assuming base64 strings are image data)
                          const isBase64 = visual.startsWith('data:image');

                          return isBase64 ? (
                            <div key={index} className="visual-image">
                              <img src={visual} alt={`visual-${index}`} className="visual-image" />
                            </div>
                          ) : (
                            <div key={index} className="visual-text">
                              <textarea
                                id="visuals"
                                name="visuals"
                                value={editedCampaign.visuals.join(', ')}
                                onChange={handleEditChange}
                              />
                            </div>
                          );
                        })
                      ) : (
                        <p>No visuals available</p>
                      )}
                    </div>
                  </div>


                  {/* User ID (Disabled) */}
                  <div className="edit-field">
                    <label htmlFor="userId">User ID</label>
                    <input
                      id="userId"
                      name="userId"
                      type="text"
                      value={editedCampaign.userId}
                      disabled
                    />
                  </div>

                  {/* Campaign ID (Disabled) */}
                  <div className="edit-field">
                    <label htmlFor="_id">Campaign ID</label>
                    <input
                      id="_id"
                      name="_id"
                      type="text"
                      value={editedCampaign._id}
                      disabled
                    />
                  </div>

                  {/* Created At (Disabled) */}
                  <div className="edit-field">
                    <label htmlFor="createdAt">Created At</label>
                    <input
                      id="createdAt"
                      name="createdAt"
                      type="text"
                      value={new Date(editedCampaign.createdAt).toLocaleString()}
                      disabled
                    />
                  </div>

                  {/* Updated At (Disabled) */}
                  <div className="edit-field">
                    <label htmlFor="updatedAt">Updated At</label>
                    <input
                      id="updatedAt"
                      name="updatedAt"
                      type="text"
                      value={new Date(editedCampaign.updatedAt).toLocaleString()}
                      disabled
                    />
                  </div>

                  <button onClick={saveEdits} className='saveButton'>Update</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <h3 className="investment-heading">Your Investments:</h3>
      {investments.length > 0 ? (
        <ul className="investment-list">
          {investments.map((investment) => (
            <li key={investment._id} className="investment-card">
              <h4 className="investment-farm">Farm: {investment.framName}</h4>
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
      <ToastContainer />
    </div>
  );
};

export default InvestorDashboard;
