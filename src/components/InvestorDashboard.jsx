import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

const InvestorDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [modalType, setModalType] = useState(''); // 'view' or 'edit'
  const [editedCampaign, setEditedCampaign] = useState(null);
  const [isRefundModalVisible, setRefundModalVisible] = useState(false);
  const [refundMessage, setRefundMessage] = useState("");
  const [currentInvestmentId, setCurrentInvestmentId] = useState(null);
  const [investments, setInvestments] = useState([]);

  const openRefundModal = (investmentId) => {
    setCurrentInvestmentId(investmentId);
    setRefundModalVisible(true);
  };

  const closeRefundModal = () => {
    setRefundModalVisible(false);
    setRefundMessage("");
    setCurrentInvestmentId(null);
  };

  const submitRefundRequest = async () => {
    if (!refundMessage) {
      console.error("Refund reason is required.");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/campaigns/refundRequest`,
        {
          Reason: refundMessage,
          investId: currentInvestmentId,
        }
      );
      alert("Your refund request is submitted. Once approved, your investment will be removed.");
    } catch (error) {
      console.error("Error submitting refund request:", error);
    } finally {
      setIsLoading(false);
      closeRefundModal();
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchCampaigns = async () => {
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleDeleteCampaign = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete('http://localhost:5000/api/campaigns/deleteCampaign', { data: { id } });
      setCampaigns(campaigns.filter(campaign => campaign._id !== id));
    } catch (error) {
      console.error('Error Deleting data:', error);
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/campaigns/editCampaign`, editedCampaign);
      setCampaigns(campaigns.map(campaign =>
        campaign._id === editedCampaign._id ? editedCampaign : campaign
      ));
      closeModal();
      toast.info("Your information has been updated");
    } catch (error) {
      console.error('Error saving edits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <ToastContainer position="top-right" autoClose={3000} />

          {/* Campaigns Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Investor Dashboard</h2>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Campaigns</h3>

            {campaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map(campaign => (
                  <div key={campaign._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition duration-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{campaign.campaignTitle}</h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.impactMetrics}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Target</span>
                        <span className="font-medium">${campaign.fundingGoal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Raised</span>
                        <span className="text-green-600 font-medium">${campaign.raisedAmount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Location</span>
                        <span className="text-gray-600">{campaign.farmLocation}</span>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => openModal(campaign, 'view')}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openModal(campaign, 'edit')}
                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(campaign._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 text-center text-gray-500">No campaigns found</div>
            )}
          </section>

          {/* Enhanced View/Edit Modal */}
          {selectedCampaign && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 custom-scrollbar">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {modalType === 'view' ? (
                      <><span className="text-blue-600">{selectedCampaign.campaignTitle}</span> Details</>
                    ) : (
                      `Edit ${selectedCampaign.campaignTitle}`
                    )}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    ✖
                  </button>
                </div>

                {modalType === 'view' ? (
                  <div className="space-y-6">
                    {/* Header Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-blue-800 mb-2">Funding Progress</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-blue-600">
                              ${selectedCampaign.raisedAmount}
                              <span className="text-sm text-gray-500 ml-1">raised</span>
                            </p>
                            <p className="text-sm text-gray-600">of ${selectedCampaign.fundingGoal} goal</p>
                          </div>
                          <div className="w-20 h-20">
                            <CircularProgress
                              value={(selectedCampaign.raisedAmount / selectedCampaign.fundingGoal) * 100}
                              strokeWidth={8}
                              className="text-blue-600"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-green-800 mb-2">Campaign Status</h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <p className="text-sm font-medium text-gray-700">Active</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {Math.ceil((new Date(selectedCampaign.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
                        </p>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-purple-800 mb-2">Investment Details</h4>
                        <p className="text-sm text-gray-700">
                          Minimum: <span className="font-medium">${selectedCampaign.minInvestment}</span>
                        </p>
                        <p className="text-sm text-gray-700">
                          Returns: <span className="font-medium">{selectedCampaign.expectedReturns}</span>
                        </p>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-6">
                        <Section title="Farmer Information">
                          <InfoItem label="Name" value={selectedCampaign.farmerName} />
                          <InfoItem label="Farm Name" value={selectedCampaign.farmName} />
                          <InfoItem label="Location" value={selectedCampaign.farmLocation} />
                          <InfoItem label="Farm Size" value={selectedCampaign.farmSize} />
                        </Section>

                        <Section title="Campaign Timeline">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Start Date</p>
                              <p className="text-sm font-medium">
                                {new Date(selectedCampaign.startDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="w-8 border-t border-gray-300 mx-2"></div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">End Date</p>
                              <p className="text-sm font-medium">
                                {new Date(selectedCampaign.endDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </Section>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        <Section title="Agriculture Details">
                          <InfoItem label="Crop Types" value={selectedCampaign.cropTypes} />
                          <InfoItem label="Farming Methods" value={selectedCampaign.farmingMethods} />
                        </Section>

                        <Section title="Visual Documentation">
                          <div className="grid grid-cols-3 gap-4">
                            {selectedCampaign.visuals?.map((visual, index) => (
                              visual.startsWith('data:image') ? (
                                <img
                                  key={index}
                                  src={visual}
                                  alt={`Visual ${index}`}
                                  className="w-full h-24 object-cover rounded-lg border"
                                />
                              ) : (
                                <div
                                  key={index}
                                  className="p-2 bg-gray-50 rounded-lg text-xs text-gray-600 break-words"
                                >
                                  {visual}
                                </div>
                              )
                            ))}
                            {selectedCampaign.visuals?.length === 0 && (
                              <p className="text-gray-500 text-sm">No visuals available</p>
                            )}
                          </div>
                        </Section>
                      </div>
                    </div>

                    {/* Full Width Sections */}
                    <Section title="Fund Utilization Plan">
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {selectedCampaign.fundUsage}
                      </p>
                    </Section>

                    <Section title="Expected Impact">
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {selectedCampaign.impactMetrics}
                      </p>
                    </Section>
                  </div>
                ) : (
                  /* Enhanced Edit Mode */
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <Section title="Basic Information">
                        <FormInput
                          label="Campaign Title"
                          name="campaignTitle"
                          value={editedCampaign.campaignTitle}
                          onChange={handleEditChange}
                        />
                        <FormInput
                          label="Farmer Name"
                          name="farmerName"
                          value={editedCampaign.farmerName}
                          onChange={handleEditChange}
                        />
                        <FormInput
                          label="Farm Location"
                          name="farmLocation"
                          value={editedCampaign.farmLocation}
                          onChange={handleEditChange}
                        />
                      </Section>

                      <Section title="Financial Targets">
                        <FormInput
                          type="number"
                          label="Funding Goal ($)"
                          name="fundingGoal"
                          value={editedCampaign.fundingGoal}
                          onChange={handleEditChange}
                        />
                        <FormInput
                          type="number"
                          label="Minimum Investment ($)"
                          name="minInvestment"
                          value={editedCampaign.minInvestment}
                          onChange={handleEditChange}
                        />
                        <FormInput
                          label="Expected Returns (%)"
                          name="expectedReturns"
                          value={editedCampaign.expectedReturns}
                          onChange={handleEditChange}
                        />
                      </Section>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <Section title="Campaign Details">
                        <FormInput
                          type="date"
                          label="Start Date"
                          name="startDate"
                          value={editedCampaign.startDate.split('T')[0]}
                          onChange={handleEditChange}
                        />
                        <FormInput
                          type="date"
                          label="End Date"
                          name="endDate"
                          value={editedCampaign.endDate.split('T')[0]}
                          onChange={handleEditChange}
                        />
                        <FormInput
                          label="Crop Types"
                          name="cropTypes"
                          value={editedCampaign.cropTypes}
                          onChange={handleEditChange}
                        />
                      </Section>

                      <Section title="Visuals & Documentation">
                        <div className="grid grid-cols-2 gap-4">
                          {editedCampaign.visuals?.map((visual, index) => (
                            <div key={index} className="relative group">
                              {visual.startsWith('data:image') ? (
                                <>
                                  <img
                                    src={visual}
                                    alt={`Visual ${index}`}
                                    className="w-full h-24 object-cover rounded-lg border"
                                  />
                                  <button
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => {
                                      const newVisuals = [...editedCampaign.visuals];
                                      newVisuals.splice(index, 1);
                                      setEditedCampaign({ ...editedCampaign, visuals: newVisuals });
                                    }}
                                  >
                                    ✖
                                  </button>
                                </>
                              ) : (
                                <input
                                  type="text"
                                  value={visual}
                                  onChange={(e) => {
                                    const newVisuals = [...editedCampaign.visuals];
                                    newVisuals[index] = e.target.value;
                                    setEditedCampaign({ ...editedCampaign, visuals: newVisuals });
                                  }}
                                  className="w-full px-3 py-2 border rounded-md text-sm"
                                />
                              )}
                            </div>
                          ))}
                          <div className="col-span-full">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setEditedCampaign({
                                      ...editedCampaign,
                                      visuals: [...editedCampaign.visuals, reader.result]
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="text-sm text-gray-600"
                            />
                          </div>
                        </div>
                      </Section>
                    </div>

                    {/* Save Button */}
                    <div className="col-span-full border-t pt-6">
                      <button
                        onClick={saveEdits}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Investments Section */}
          <section className="mb-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Investments</h3>
            {investments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investments.map(investment => (
                  <div key={investment._id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-800">
                        Farm: <span className="text-green-600">{investment.farmName}</span>
                      </h4>
                      <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                        ${investment.amount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                      <span>{new Date(investment.date).toLocaleDateString()}</span>
                      <span className="text-gray-400">ID: {investment._id.slice(-6)}</span>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => openRefundModal(investment._id)}
                        className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
                      >
                        Request Refund
                      </button>
                      <Link
                        to={`/campaign/${investment.campaignId._id}`}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 text-sm flex items-center"
                      >
                        View Farm
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 text-center text-gray-500">No investments found</div>
            )}
          </section>

          {/* Refund Modal */}
          {isRefundModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg w-full max-w-md p-6">
                <h4 className="text-lg font-semibold mb-4">Refund Request</h4>
                <textarea
                  value={refundMessage}
                  onChange={(e) => setRefundMessage(e.target.value)}
                  placeholder="Please explain the reason for your refund request..."
                  className="w-full px-3 py-2 border rounded-md mb-4 h-32"
                />
                <div className="flex justify-end space-x-3">
                  <button onClick={closeRefundModal} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                    Cancel
                  </button>
                  <button onClick={submitRefundRequest} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
// Helper Components
const Section = ({ title, children }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200">
    <h4 className="text-sm font-semibold text-gray-800 mb-3">{title}</h4>
    {children}
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm font-medium text-gray-800">{value}</span>
  </div>
);

const FormInput = ({ label, type = 'text', ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      {...props}
      className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

// Circular Progress Component
const CircularProgress = ({ value, strokeWidth = 8, className }) => (
  <div className="relative w-full h-full">
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <circle
        className="text-gray-200"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r="45"
        cx="50"
        cy="50"
      />
      <circle
        className={className}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r="45"
        cx="50"
        cy="50"
        strokeDasharray={`${2 * Math.PI * 45}`}
        strokeDashoffset={`${2 * Math.PI * 45 * (1 - value / 100)}`}
        transform="rotate(-90 50 50)"
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-sm font-bold">{Math.round(value)}%</span>
    </div>
  </div>
);

export default InvestorDashboard;