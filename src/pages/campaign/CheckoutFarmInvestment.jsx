import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const CheckoutFarmInvestment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const endpoint = useSelector((state) => state.endpoint.endpoint);
  
  // Campaign data passed from CampaignDetails
  const passedCampaign = location.state?.campaign;
  const [campaign, setCampaign] = useState(passedCampaign || null);
  
  // Quantity is number of minimum investment units
  const [quantity, setQuantity] = useState(1);
  const [investing, setInvesting] = useState(false);

  useEffect(() => {
    if (campaign) {
      // Initialize with 1 unit (minimum investment)
      setQuantity(1);
    }
  }, [campaign]);

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <p>Loading campaign details...</p>
      </div>
    );
  }

  const minInvestment = parseInt(campaign.minInvestment, 10);
  const fundingGoal = parseInt(campaign.fundingGoal, 10);
  const raisedAmount = parseInt(campaign.raisedAmount, 10);
  const remainingAmount = fundingGoal - raisedAmount;

  // Calculate the maximum units allowed based on remaining funding
  const maxUnits = Math.floor(remainingAmount / minInvestment);
  
  // Total investment amount = quantity * minimum investment
  const totalInvestment = quantity * minInvestment;
  
  // Calculate the approximate percentage share
  const percentageShare = ((totalInvestment / fundingGoal) * 100).toFixed(2);

  const handleIncrement = () => {
    if (quantity < maxUnits) {
      setQuantity(quantity + 1);
    } else {
      toast.error('You have reached the maximum available investment.');
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleConfirmInvestment = async () => {
    if (totalInvestment < minInvestment) {
      toast.error(`Minimum investment of ₹${minInvestment} is required`);
      return;
    }
    setInvesting(true);
    try {
      // Update raised amount in the campaign
      await axios.put(`${endpoint}/campaigns/${campaign._id}/raisedAmount`, {
        amount: totalInvestment,
        userId: campaign._id,
        name: campaign.campaignTitle,
      });
      // Log the investment
      await axios.post(
        `${endpoint}/campaigns/${campaign._id}/investment`,
        { amount: totalInvestment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      toast.success('Investment successful!');
      navigate(`/campaign/${campaign._id}`); // redirect to campaign page or confirmation page
    } catch (error) {
      console.error('Error investing:', error);
      toast.error(error.response?.data?.message || 'Investment failed');
    } finally {
      setInvesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-emerald-100 p-8 space-y-8"
      >
        {/* Campaign Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-emerald-900">{campaign.campaignTitle}</h1>
          <p className="text-emerald-700">{campaign.description || 'No description available.'}</p>
        </div>

        {/* Order Summary Section */}
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
          <h2 className="text-xl font-bold text-emerald-800 mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span className="text-emerald-600">Minimum Investment per Unit:</span>
            <span className="text-emerald-900 font-semibold">₹{minInvestment}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-emerald-600">Units Selected:</span>
            <span className="text-emerald-900 font-semibold">{quantity}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-emerald-600">Total Investment:</span>
            <span className="text-emerald-900 font-semibold">₹{totalInvestment}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-600">Your Farm Share:</span>
            <span className="text-emerald-900 font-semibold">{percentageShare}%</span>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleDecrement}
            className="px-3 py-2 bg-emerald-200 text-emerald-800 rounded-full hover:bg-emerald-300 transition"
          >
            –
          </button>
          <div className="text-xl font-bold text-emerald-900"> {quantity} </div>
          <button
            onClick={handleIncrement}
            className="px-3 py-2 bg-emerald-200 text-emerald-800 rounded-full hover:bg-emerald-300 transition"
          >
            +
          </button>
        </div>

        {/* Payment Options */}
        <div className="bg-white p-6 rounded-2xl border border-emerald-200">
          <h2 className="text-xl font-bold text-emerald-800 mb-4">Payment Options</h2>
          <div className="flex gap-4">
            <button className="flex-1 px-4 py-2 bg-white border-2 border-emerald-300 hover:bg-emerald-50 rounded-xl transition">
              Credit Card
            </button>
            <button className="flex-1 px-4 py-2 bg-white border-2 border-emerald-300 hover:bg-emerald-50 rounded-xl transition">
              UPI
            </button>
            <button className="flex-1 px-4 py-2 bg-white border-2 border-emerald-300 hover:bg-emerald-50 rounded-xl transition">
              Net Banking
            </button>
          </div>
        </div>

        {/* Detailed Campaign Info */}
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
          <h2 className="text-xl font-bold text-emerald-800 mb-4">Campaign Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-emerald-600">Funding Goal:</span>
              <span className="font-semibold text-emerald-900">₹{campaign.fundingGoal}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-emerald-600">Raised Amount:</span>
              <span className="font-semibold text-emerald-900">₹{campaign.raisedAmount}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-emerald-600">Days Remaining:</span>
              <span className="font-semibold text-emerald-900">
                {Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 3600 * 24))}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-emerald-600">Farmer Name:</span>
              <span className="font-semibold text-emerald-900">{campaign.farmerName}</span>
            </div>
          </div>
        </div>

        {/* Confirm Investment Button */}
        <button
          onClick={handleConfirmInvestment}
          disabled={investing}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-semibold rounded-xl transition transform hover:scale-[1.02] shadow-lg"
        >
          {investing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="h-6 w-6 mx-auto border-2 border-t-transparent border-white rounded-full"
            />
          ) : (
            'Confirm Investment'
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default CheckoutFarmInvestment;
