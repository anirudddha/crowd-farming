import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FiArrowLeft, FiDollarSign, FiPieChart, FiCalendar, FiMapPin } from 'react-icons/fi';
import {FaLeaf} from "react-icons/fa";

const InvestedFarmDetailsById = () => {
  const { campaignId, investmentId } = useParams();
  const endpoint = useSelector((state) => state.endpoint.endpoint);
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [investmentDetails, setInvestmentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data fetching logic remains same as previous version

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

  const formatDate = (dateStr) => 
    new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">Loading...</div>;
  if (!campaign) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">Campaign not found</div>;

  const investedAmount = investmentDetails?.amount || 0;
  const sharePercentage = ((investedAmount / campaign.fundingGoal) * 100).toFixed(2);
  const progress = ((campaign.raisedAmount / campaign.fundingGoal) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Back Navigation */}
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-8 flex items-center text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Back to Investments
          </button>

          {/* Campaign Header */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 to-teal-800/50 z-10" />
            <Carousel
              showArrows={true}
              infiniteLoop={true}
              showThumbs={false}
              autoPlay={true}
              interval={5000}
              className="h-96"
            >
              {campaign.visuals.map((visual, index) => (
                <div key={index} className="h-96">
                  <img
                    src={visual.url}
                    alt={`Campaign visual ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </Carousel>
            
            <div className="absolute bottom-0 left-0 right-0 z-20 p-8 text-white">
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">{campaign.campaignTitle}</h1>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <FiMapPin className="mr-2" />
                  <span>{campaign.farmLocation}</span>
                </div>
                <div className="flex items-center">
                  <FaLeaf className="mr-2" />
                  <span>{campaign.farmingMethods} Farming</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Campaign Progress */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-emerald-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Funding Progress</h2>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Raised: ₹{campaign.raisedAmount?.toLocaleString()}</span>
                    <span>Goal: ₹{campaign.fundingGoal?.toLocaleString()}</span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <div className="flex items-center mb-2">
                      <FiCalendar className="text-emerald-600 mr-2" />
                      <span className="font-semibold">Start Date</span>
                    </div>
                    <p className="text-gray-700">{formatDate(campaign.startDate)}</p>
                  </div>
                  <div className="p-4 bg-teal-50 rounded-xl">
                    <div className="flex items-center mb-2">
                      <FiCalendar className="text-teal-600 mr-2" />
                      <span className="font-semibold">End Date</span>
                    </div>
                    <p className="text-gray-700">{formatDate(campaign.endDate)}</p>
                  </div>
                </div>
              </div>

              {/* Farm Details */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-emerald-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Farm Overview</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                        <FaLeaf className="text-2xl text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Crop Type</p>
                        <p className="font-semibold text-gray-900">{campaign.cropTypes}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="p-3 bg-teal-100 rounded-lg mr-4">
                        <FiDollarSign className="text-2xl text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Minimum Investment</p>
                        <p className="font-semibold text-gray-900">₹{campaign.minInvestment?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="p-3 bg-amber-100 rounded-lg mr-4">
                        <FiPieChart className="text-2xl text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Expected Returns</p>
                        <p className="font-semibold text-gray-900">{campaign.expectedReturns}% Annually</p>
                      </div>
                    </div>
                    <div>
                  </div>
                </div>
              </div>
            </div>

              {/* Timeline Section */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-emerald-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Project Timeline</h2>
                <div className="relative space-y-8 pl-6 border-l-2 border-emerald-100">
                  {timeline.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      <div className="absolute w-4 h-4 bg-emerald-500 rounded-full border-2 border-white -left-[25px] top-5 shadow-lg" />
                      <div className="bg-gray-50 p-6 rounded-xl border border-emerald-50 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                            <p className="text-sm text-emerald-600">{formatDate(event.date)}</p>
                          </div>
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                            Phase {index + 1}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-6">{event.description}</p>
                        <div className="grid grid-cols-3 gap-4">
                          {event.images?.map((img, imgIndex) => (
                            <div
                              key={imgIndex}
                              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:transform hover:scale-105 transition-transform"
                            >
                              <img
                                src={img}
                                alt={`Timeline visual ${imgIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Investment Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-emerald-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Your Investment</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
                    <div>
                      <p className="text-sm text-emerald-600 mb-1">Invested Amount</p>
                      <p className="text-2xl font-bold text-gray-900">₹{investedAmount.toLocaleString()}</p>
                    </div>
                    <FiDollarSign className="text-3xl text-emerald-500" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl">
                    <div>
                      <p className="text-sm text-teal-600 mb-1">Farm Ownership</p>
                      <p className="text-2xl font-bold text-gray-900">{sharePercentage}%</p>
                    </div>
                    <FiPieChart className="text-3xl text-teal-500" />
                  </div>

                  <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl text-white">
                    <p className="text-sm mb-2">Estimated Annual Return</p>
                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-bold">₹{(investedAmount * (campaign.expectedReturns/100)).toLocaleString()}</p>
                      <span className="text-sm bg-white/20 px-3 py-1 rounded-full">+{campaign.expectedReturns}%</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-emerald-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Investment Date</span>
                      <span className="font-medium text-gray-900">
                        {formatDate(investmentDetails?.date)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Campaign ID</span>
                      <span className="font-mono text-sm text-gray-900">{campaignId.slice(-6)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InvestedFarmDetailsById;