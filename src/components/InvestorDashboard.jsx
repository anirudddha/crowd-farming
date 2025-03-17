import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import DashboardView from './DashboardView';
import DashboardEdit from './DashboardEdit';

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
      await axios.post(`http://localhost:5000/api/campaigns/refundRequest`, {
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
        const response = await axios.get('http://localhost:5000/api/user-campaigns', {
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
  const handleDeleteCampaign = useCallback(async (id) => {
    setIsLoading(true);
    try {
      await axios.delete('http://localhost:5000/api/campaigns/deleteCampaign', { data: { id } });
      setCampaigns(campaigns.filter(campaign => campaign._id !== id));
    } catch (error) {
      console.error('Error deleting campaign:', error);
    } finally {
      setIsLoading(false);
    }
  }, [campaigns]);

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

  // Update editedCampaign state for both text fields and new file objects.
  const handleEditChange = (e) => {
    setEditedCampaign({ ...editedCampaign, [e.target.name]: e.target.value });
  };

  const saveEdits = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      // Append all text fields
      formData.append('farmerName', editedCampaign.farmerName);
      formData.append('phoneNumber', editedCampaign.phoneNumber);
      formData.append('email', editedCampaign.email);
      formData.append('farmName', editedCampaign.farmName);
      formData.append('farmLocation', editedCampaign.farmLocation);
      formData.append('farmSize', editedCampaign.farmSize);
      formData.append('campaignTitle', editedCampaign.campaignTitle);
      formData.append('fundingGoal', editedCampaign.fundingGoal);
      formData.append('minInvestment', editedCampaign.minInvestment);
      formData.append('expectedReturns', editedCampaign.expectedReturns);
      formData.append('cropTypes', editedCampaign.cropTypes);
      formData.append('farmingMethods', editedCampaign.farmingMethods);
      formData.append('startDate', editedCampaign.startDate);
      formData.append('endDate', editedCampaign.endDate);
      formData.append('fundUsage', editedCampaign.fundUsage);
      formData.append('impactMetrics', editedCampaign.impactMetrics);
      
      // Append existing visuals as a JSON string (if needed by your backend to preserve removed images)
      formData.append('visuals', JSON.stringify(editedCampaign.visuals));
      
      // Append new visuals files, if any.
      if (editedCampaign.newVisuals && editedCampaign.newVisuals.length > 0) {
        editedCampaign.newVisuals.forEach(file => {
          formData.append('visuals', file);
        });
      }

      await axios.put(`http://localhost:5000/api/campaigns/editCampaign/${editedCampaign._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      // Optionally update the local campaigns state with the editedCampaign
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
                  <DashboardEdit editedCampaign={editedCampaign} handleEditChange={handleEditChange} saveEdits={saveEdits} closeModal={closeModal} />
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
