import React, { useEffect, useState } from 'react';
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

  // Fetch campaigns and investments
  useEffect(() => {
    setIsLoading(true);
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user-campaigns', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

  // Campaign Handlers
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

          {/* Modal for View/Edit */}
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
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 transition-colors">
                    ✖
                  </button>
                </div>
                {modalType === 'view' ? (
                  <DashboardView campaign={selectedCampaign} closeModal={closeModal} />
                ) : (
                  <DashboardEdit
                    editedCampaign={editedCampaign}
                    handleEditChange={handleEditChange}
                    saveEdits={saveEdits}
                    closeModal={closeModal}
                  />
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

export default InvestorDashboard;
