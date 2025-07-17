import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import DashboardView from './DashboardView';
import DashboardEdit from './DashboardEdit';
import { useSelector } from 'react-redux';

const InvestorDashboard = () => {

  const endpoint = useSelector(state => state.endpoint.endpoint);

  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [modalType, setModalType] = useState(''); // 'view' or 'edit'
  const [editedCampaign, setEditedCampaign] = useState(null);
  const [isRefundModalVisible, setRefundModalVisible] = useState(false);
  const [refundMessage, setRefundMessage] = useState("");
  const [currentInvestmentId, setCurrentInvestmentId] = useState(null);
  const [investments, setInvestments] = useState([]);

  // Refund Modal Handlers
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
      await axios.post(`${endpoint}/campaigns/refundRequest`, {
        Reason: refundMessage,
        investId: currentInvestmentId,
      });
      alert("Your refund request is submitted. Once approved, your investment will be removed.");
    } catch (error) {
      console.error("Error submitting refund request:", error);
    } finally {
      setIsLoading(false);
      closeRefundModal();
    }
  };

  // Fetch campaigns and investments with caching
  useEffect(() => {
    const fetchCampaigns = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const cacheKey = `investorDashboardData_${token}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const { campaigns: cachedCampaigns, investments: cachedInvestments } = JSON.parse(cachedData);
        setCampaigns(cachedCampaigns);
        setInvestments(cachedInvestments);
        setIsLoading(false);
      }
      try {
        const response = await axios.get(`${endpoint}/user-campaigns`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { campaigns: fetchedCampaigns, investments: fetchedInvestments } = response.data;
        setCampaigns(fetchedCampaigns);
        setInvestments(fetchedInvestments);
        localStorage.setItem(cacheKey, JSON.stringify({ campaigns: fetchedCampaigns, investments: fetchedInvestments }));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Campaign Handlers
  const handleDeleteCampaign = useCallback(async (campaignId) => {
    if (!window.confirm('Are you sure you want to permanently delete this campaign?')) {
      return;
    }

    setIsLoading(true);

    // Get the token directly from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Authentication error. Please log in again.');
      setIsLoading(false);
      return;
    }

    try {
      await axios.delete(`${endpoint}/campaigns/${campaignId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Campaign deleted successfully!');
      setCampaigns(campaigns.filter(campaign => campaign._id !== campaignId));

    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Error deleting campaign.';
      console.error('Error deleting campaign:', error.response || error);
      toast.error(errorMessage);

    } finally {
      setIsLoading(false);
    }
  }, [campaigns, endpoint, setIsLoading, setCampaigns]);

  const openModal = (campaign, type) => {
    setSelectedCampaign(campaign);
    // Initialize editedCampaign with a newVisuals property for new files
    setEditedCampaign({ ...campaign, newVisuals: [] });
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedCampaign(null);
    setModalType('');
  };

  const handleEditChange = (e) => {
    const { name, value, type } = e.target;
    const [field, subField] = name.split('.'); // e.g., name="expectedReturns.min"

    if (subField) {
      // It's a nested property
      setEditedCampaign(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subField]: type === 'number' ? parseFloat(value) || 0 : value,
        },
      }));
    } else {
      // It's a flat property
      setEditedCampaign(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
      }));
    }
  };

  // Special handler for new file uploads and visual removals
  const handleVisualsChange = (visualsUpdate) => {
    setEditedCampaign(prev => ({ ...prev, ...visualsUpdate }));
  }

  const saveEdits = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // --- Append all fields as expected by the backend ---

      // Append simple text fields
      formData.append('campaignTitle', editedCampaign.campaignTitle);
      formData.append('farmName', editedCampaign.farmName);
      formData.append('farmLocation', editedCampaign.farmLocation);
      formData.append('fundingGoal', editedCampaign.fundingGoal);
      formData.append('minInvestment', editedCampaign.minInvestment);
      formData.append('startDate', editedCampaign.startDate);
      formData.append('endDate', editedCampaign.endDate);
      formData.append('fundUsage', editedCampaign.fundUsage);
      formData.append('impactMetrics', editedCampaign.impactMetrics);
      formData.append('story', editedCampaign.story);
      formData.append('riskFactors', editedCampaign.riskFactors);
      formData.append('farmingMethods', editedCampaign.farmingMethods);

      // Append structured data for farmSize
      formData.append('farmSizeValue', editedCampaign.farmSize.value);
      formData.append('farmSizeUnit', editedCampaign.farmSize.unit);

      // Append structured data for expectedReturns
      formData.append('returnsType', editedCampaign.expectedReturns.type);
      formData.append('returnsMin', editedCampaign.expectedReturns.min);
      formData.append('returnsMax', editedCampaign.expectedReturns.max || ''); // Send empty string if max is not set
      formData.append('returnsDescription', editedCampaign.expectedReturns.description);

      // Append cropTypes as a comma-separated string
      if (Array.isArray(editedCampaign.cropTypes)) {
        formData.append('cropTypes', editedCampaign.cropTypes.join(', '));
      } else {
        formData.append('cropTypes', editedCampaign.cropTypes);
      }

      // Append existing visuals as a JSON string
      formData.append('visuals', JSON.stringify(editedCampaign.visuals));

      // Append new visuals files, if any
      if (editedCampaign.newVisuals && editedCampaign.newVisuals.length > 0) {
        editedCampaign.newVisuals.forEach(file => {
          formData.append('visuals', file); // Backend expects 'visuals' key for new files
        });
      }

      // **FIXED: Correct API endpoint and method**
      const response = await axios.put(`${endpoint}/campaigns/editCampaign/${editedCampaign._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update the local campaigns state with the new data from the server
      setCampaigns(campaigns.map(campaign =>
        campaign._id === editedCampaign._id ? response.data : campaign
      ));
      closeModal();
      toast.info("Your campaign has been updated successfully!");

    } catch (error) {
      console.error('Error saving edits:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to update campaign.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Campaigns Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Investor Dashboard</h2>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Campaigns</h3>
            {campaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map(campaign => (
                  <div key={campaign._id} className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="p-6 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                          {campaign.campaignTitle}
                        </h4>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          Active
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 italic">
                        "{campaign.impactMetrics}"
                      </p>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-gray-500">{new Date(campaign.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="relative pt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-green-600">Raised: ${campaign.raisedAmount}</span>
                            <span className="text-gray-500">Goal: ${campaign.fundingGoal}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 rounded-full h-2 transition-all duration-500" style={{ width: `${(campaign.raisedAmount / campaign.fundingGoal * 100)}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm text-gray-600">{campaign.farmLocation}</span>
                        </div>
                      </div>
                      <div className="mt-auto flex gap-3">
                        <button onClick={() => openModal(campaign, 'view')} className="flex-1 px-4 py-2 bg-white border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 text-sm font-medium transition-colors">
                          Details
                        </button>
                        <div className="flex gap-1">
                          <button onClick={() => openModal(campaign, 'edit')} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors">
                            ✏️
                          </button>
                          <button onClick={() => handleDeleteCampaign(campaign._id)} className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors">
                            🗑️
                          </button>
                          <Link
                            to={`/add-timeline-update/${campaign._id}`}
                            className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            Add Update
                          </Link>

                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>You have not made any campaign yet</div>
            )}
          </section>

          {/* Modal for View/Edit */}
          {selectedCampaign && (
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
              <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 custom-scrollbar">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {modalType === 'view' ? (
                      <>
                        <span className="text-blue-600">{selectedCampaign.campaignTitle}</span> Details
                      </>
                    ) : (
                      `Edit ${selectedCampaign.campaignTitle}`
                    )}
                  </h3>
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 transition-colors">✖</button>
                </div>
                {modalType === 'view' ? (
                  <DashboardView campaign={selectedCampaign} closeModal={closeModal} />
                ) : (
                  <DashboardEdit
                    editedCampaign={editedCampaign}
                    handleEditChange={handleEditChange}
                    handleVisualsChange={handleVisualsChange} /* <-- PASS THE PROP HERE */
                    saveEdits={saveEdits}
                    closeModal={closeModal}
                  />)}
              </div>
            </div>
          )}

          {/* Investments Section */}
          <section className="mb-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Investments</h3>
            {investments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investments.map(investment => (
                  <div key={investment._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-1">{investment.farmName}</h4>
                          <span className="text-xs text-gray-500">Invested on {new Date(investment.date).toLocaleDateString()}</span>
                        </div>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">Active</span>
                      </div>
                      <div className="flex items-end justify-between mb-6">
                        <div>
                          <span className="text-2xl font-bold text-green-600">${investment.amount}</span>
                          <span className="text-xs text-gray-500 block mt-1">Investment</span>
                        </div>
                        <span className="text-xs text-gray-400">ID: {investment._id.slice(-6)}</span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => openRefundModal(investment._id)}
                          className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10M3 14h10m-10-4v6m0 0l-3-3m3 3l3-3m4 2a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          Refund
                        </button>
                        <Link to={`/campaign/${investment.campaignId?._id}`} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          View
                        </Link>
                        <Link
                          to={`/invested-farm-details/${investment.campaignId._id}/${investment._id}`}
                          className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          View Timeline
                        </Link>

                      </div>
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
                  <button onClick={closeRefundModal} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                  <button onClick={submitRefundRequest} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Submit Request</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InvestorDashboard;
