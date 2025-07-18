// src/pages/Dashboard/InvestorDashboard/InvestorDashboard.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

import '../../../styles/Dashboard.css';
import Loader from '../../../components/Loader';
import DashboardView from './components/DashboardView';
import DashboardEdit from './components/DashboardEdit';
import CampaignCard from './components/CampaignCard';
import InvestmentCard from './components/InvestmentCard';
import RefundModal from './components/RefundModal';
import EmptyState from './components/EmptyState';

const InvestorDashboard = () => {
  const endpoint = useSelector(state => state.endpoint.endpoint);

  const [isLoading, setIsLoading] = useState(true); // Start with true
  const [isSubmitting, setIsSubmitting] = useState(false); // For modal submissions
  const [campaigns, setCampaigns] = useState([]);
  const [investments, setInvestments] = useState([]);
  
  // Modal State
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [modalType, setModalType] = useState(''); // 'view' or 'edit'
  const [editedCampaign, setEditedCampaign] = useState(null);

  // Refund Modal State
  const [isRefundModalVisible, setRefundModalVisible] = useState(false);
  const [refundMessage, setRefundMessage] = useState("");
  const [currentInvestmentId, setCurrentInvestmentId] = useState(null);

  // Fetch campaigns and investments
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${endpoint}/user-campaigns`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { campaigns: fetchedCampaigns, investments: fetchedInvestments } = response.data;
      setCampaigns(fetchedCampaigns || []);
      setInvestments(fetchedInvestments || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Campaign Handlers
  const handleDeleteCampaign = useCallback(async (campaignId) => {
    if (!window.confirm('Are you sure? This will permanently delete the campaign and all its data.')) return;

    setIsLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${endpoint}/campaigns/${campaignId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Campaign deleted successfully!');
      setCampaigns(prev => prev.filter(c => c._id !== campaignId));
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Error deleting campaign.');
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  const openModal = (campaign, type) => {
    setSelectedCampaign(campaign);
    setEditedCampaign({ ...campaign, newVisuals: [] });
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedCampaign(null);
    setModalType('');
  };

  const handleEditChange = (e) => {
    const { name, value, type } = e.target;
    const [field, subField] = name.split('.');

    if (subField) {
      setEditedCampaign(prev => ({
        ...prev,
        [field]: { ...prev[field], [subField]: type === 'number' ? parseFloat(value) || 0 : value },
      }));
    } else {
      setEditedCampaign(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    }
  };

  const handleVisualsChange = (visualsUpdate) => {
    setEditedCampaign(prev => ({ ...prev, ...visualsUpdate }));
  };

  const saveEdits = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Simplified form data appending
      Object.keys(editedCampaign).forEach(key => {
        if (key === 'farmSize' || key === 'expectedReturns') {
            Object.keys(editedCampaign[key]).forEach(subKey => {
                formData.append(`${key}${subKey.charAt(0).toUpperCase() + subKey.slice(1)}`, editedCampaign[key][subKey]);
            });
        } else if (key === 'cropTypes' && Array.isArray(editedCampaign[key])) {
            formData.append(key, editedCampaign[key].join(', '));
        } else if (key === 'visuals' && Array.isArray(editedCampaign[key])) {
            formData.append(key, JSON.stringify(editedCampaign[key]));
        } else if (key === 'newVisuals' && editedCampaign.newVisuals.length > 0) {
            editedCampaign.newVisuals.forEach(file => formData.append('visuals', file));
        } else if (key !== '_id' && key !== '__v' && key !== 'newVisuals') {
            formData.append(key, editedCampaign[key]);
        }
      });

      const response = await axios.put(`${endpoint}/campaigns/editCampaign/${editedCampaign._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCampaigns(campaigns.map(c => c._id === editedCampaign._id ? response.data : c));
      closeModal();
      toast.info("Campaign updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update campaign.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      toast.warn("Refund reason is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${endpoint}/campaigns/refundRequest`, {
        Reason: refundMessage,
        investId: currentInvestmentId,
      });
      toast.success("Your refund request has been submitted for review.");
    } catch (error) {
      toast.error("Error submitting refund request.");
    } finally {
      setIsSubmitting(false);
      closeRefundModal();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-lg text-gray-600">Manage your campaigns and track your investments.</p>
        </header>

        {/* Campaigns Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Your Campaigns</h2>
          {campaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.map(campaign => (
                <CampaignCard
                  key={campaign._id}
                  campaign={campaign}
                  onOpenModal={openModal}
                  onDeleteCampaign={handleDeleteCampaign}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="You haven't created any campaigns yet." ctaText="Create First Campaign" ctaLink="/create-campaign" />
          )}
        </section>

        {/* Investments Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">Your Investments</h2>
          {investments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {investments.map(investment => (
                <InvestmentCard 
                  key={investment._id}
                  investment={investment}
                  onOpenRefundModal={openRefundModal}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="You haven't made any investments yet." ctaText="Explore Campaigns" ctaLink="/campaigns" />
          )}
        </section>
      </div>

      {/* View/Edit Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/30 bg-opacity-60">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 custom-scrollbar">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h3 className="text-2xl font-bold text-gray-800">
                {modalType === 'view' ? `${selectedCampaign.campaignTitle} Details` : `Edit ${selectedCampaign.campaignTitle}`}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 transition-colors text-2xl">×</button>
            </div>
            {modalType === 'view' ? (
              <DashboardView campaign={selectedCampaign} closeModal={closeModal} />
            ) : (
              <DashboardEdit
                editedCampaign={editedCampaign}
                handleEditChange={handleEditChange}
                handleVisualsChange={handleVisualsChange}
                saveEdits={saveEdits}
                closeModal={closeModal}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      )}

      {/* Refund Modal */}
      <RefundModal 
        isVisible={isRefundModalVisible}
        onClose={closeRefundModal}
        onSubmit={submitRefundRequest}
        message={refundMessage}
        setMessage={setRefundMessage}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default InvestorDashboard;