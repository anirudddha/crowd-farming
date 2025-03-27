import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const InvestedFarmDetailsById = () => {
  // Get campaignId and investmentId from the URL
  const { campaignId, investmentId } = useParams();
  const endpoint = useSelector((state) => state.endpoint.endpoint);
  const navigate = useNavigate();

  // State for campaign details, timeline data and investment details
  const [campaign, setCampaign] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [investmentDetails, setInvestmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch campaign details using campaignId
  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        const response = await axios.get(`${endpoint}/campaigns/${campaignId}`);
        setCampaign(response.data);
        console.log(response.data);

        // Use timeline data if provided by backend; otherwise use demo timeline data.
        if (response.data.timeline && response.data.timeline.length > 0) {
          setTimeline(response.data.timeline);
        } else {
          setTimeline([
            {
              date: "2023-05-01",
              title: "Farm Preparation",
              description: "Soil testing and groundwork were completed to set the stage for planting.",
              images: [
                "https://images.pexels.com/photos/96715/pexels-photo-96715.jpeg?cs=srgb&dl=pexels-alejandro-barron-21404-96715.jpg&fm=jpg",
                "https://images.pexels.com/photos/96715/pexels-photo-96715.jpeg?cs=srgb&dl=pexels-alejandro-barron-21404-96715.jpg&fm=jpg"
              ]
            },
            {
              date: "2023-06-15",
              title: "Planting Season",
              description: "Crops were planted with careful seed selection and proper scheduling.",
              images: [
                "https://images.pexels.com/photos/96715/pexels-photo-96715.jpeg?cs=srgb&dl=pexels-alejandro-barron-21404-96715.jpg&fm=jpg"
              ]
            },
            {
              date: "2023-07-20",
              title: "Irrigation Setup",
              description: "Modern irrigation systems were installed to ensure optimal water usage.",
              images: [
                "https://images.pexels.com/photos/96715/pexels-photo-96715.jpeg?cs=srgb&dl=pexels-alejandro-barron-21404-96715.jpg&fm=jpg"
              ]
            },
            {
              date: "2023-09-05",
              title: "Harvest Preparation",
              description: "Preparations for harvest began, including equipment checks and labor planning.",
              images: [
                "https://images.pexels.com/photos/96715/pexels-photo-96715.jpeg?cs=srgb&dl=pexels-alejandro-barron-21404-96715.jpg&fm=jpg"
              ]
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching campaign details:', error);
        toast.error("Failed to load campaign details.");
      }
    };

    // Fetch investment details using investmentId
    const fetchInvestmentDetails = async () => {
      try {
        const response = await axios.get(`${endpoint}/campaigns/${investmentId}/investment-details`);
        // campaigns/:id/investment-details
        setInvestmentDetails(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error('Error fetching investment details:', error);
        toast.error("Failed to load investment details.");
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchCampaignDetails(), fetchInvestmentDetails()]);
      setLoading(false);
    };

    fetchData();
  }, [campaignId, investmentId, endpoint]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Campaign not found.</p>
      </div>
    );
  }

  // Determine invested amount and calculate share percentage.
  const investedAmount = investmentDetails?.amount || 0;
  const fundingGoal = parseInt(campaign.fundingGoal, 10) || 1;
  const calculatedShare = ((investedAmount / fundingGoal) * 100).toFixed(2);
//   let a = investmentDetails.amount*100/ campaign.fundingGoal;
  const sharePercentage = investmentDetails.amount*100/ campaign.fundingGoal;

  // Helper to format dates
  const formatDate = (dateStr) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-emerald-100 p-8"
      >
        {/* Header: Campaign & Farm Details */}
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">{campaign.campaignTitle}</h1>
            <p className="text-emerald-700 mt-2">{campaign.description}</p>
            <div className="mt-4">
              <span className="text-sm text-gray-600">Farm: </span>
              <span className="text-lg font-semibold text-gray-800">{campaign.farmName}</span>
            </div>
            <div className="mt-1">
              <span className="text-sm text-gray-600">Location: </span>
              <span className="text-lg font-semibold text-gray-800">{campaign.farmLocation}</span>
            </div>
          </div>
          {/* Investment Summary */}
          <div className="mt-4 md:mt-0 text-right">
            <div className="bg-emerald-100 rounded-xl p-4">
              <p className="text-sm text-gray-600">Your Investment</p>
              <p className="text-2xl font-bold text-emerald-800">₹{investedAmount}</p>
            </div>
            <div className="bg-teal-100 rounded-xl p-4 mt-4">
              <p className="text-sm text-gray-600">Your Farm Share</p>
              <p className="text-2xl font-bold text-teal-800">{sharePercentage}%</p>
            </div>
            {investmentDetails?.investmentDate && (
              <div className="bg-blue-100 rounded-xl p-4 mt-4">
                <p className="text-sm text-gray-600">Investment Date</p>
                <p className="text-xl font-bold text-blue-800">
                  {new Date(investmentDetails.investmentDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Section */}
        <h2 className="text-2xl font-bold text-emerald-900 mb-6">Farm Timeline</h2>
        <div className="relative border-l-2 border-emerald-200 ml-6">
          {timeline.map((event, index) => (
            <div key={index} className="mb-8 pl-4 relative">
              <div className="absolute -left-3 top-0 w-6 h-6 bg-emerald-600 rounded-full border-2 border-white shadow"></div>
              <div className="mb-1">
                <span className="text-sm font-medium text-emerald-900">{event.title}</span>
                <span className="text-xs text-gray-500 ml-2">{formatDate(event.date)}</span>
              </div>
              <p className="text-sm text-emerald-700 mb-2">{event.description}</p>
              <div className="flex gap-4">
                {event.images.map((imgUrl, imgIndex) => (
                  <img 
                    key={imgIndex}
                    src={imgUrl}
                    alt={`${event.title} ${imgIndex + 1}`}
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Button */}
        <div className="mt-10 text-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default InvestedFarmDetailsById;
