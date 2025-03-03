import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowUpRight, CircleDollarSign, Leaf, Coins, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast'; // Ensure you have react-hot-toast installed

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // UI state for modal and sections
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);

  // Razorpay states
  const [responseId, setResponseId] = useState('');
  const [responseState, setResponseState] = useState([]);

  // Investing loader state
  const [investing, setInvesting] = useState(false);

  // Helper to load external script (Razorpay)
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = (amount) => {
    const data = JSON.stringify({
      amount: amount * 100,
      currency: 'INR',
    });
    axios
      .post('http://localhost:5000/api/campaigns/razorInvestment', data, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => {
        console.log(response.data);
        handleRazorpayScreen(response.data.amount);
      })
      .catch((error) => {
        console.error('Error creating Razorpay order:', error);
      });
  };

  const handleRazorpayScreen = async (amount) => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }
    const options = {
      key: 'rzp_test_ZAIFieaCGZHqsn',
      amount,
      currency: 'INR',
      name: 'Papaya Coders',
      description: 'Payment to Papaya Coders',
      image: 'https://papayacoders.com/demo.png',
      handler: function (response) {
        setResponseId(response.razorpay_payment_id);
      },
      prefill: {
        name: 'Papaya Coders',
        email: 'papayacoders@gmail.com',
      },
      theme: {
        color: '#34D399', // green-400
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    // Trigger invest after opening payment window (if that is intended)
    handleInvest();
  };

  const paymentFetch = (e) => {
    e.preventDefault();
    const paymentId = e.target.paymentId.value;
    axios
      .get(`http://localhost:5000/api/campaigns/getReciept/${paymentId}`)
      .then((response) => {
        console.log(response.data);
        setResponseState(response.data);
      })
      .catch((error) => {
        console.error('Error fetching receipt:', error);
      });
  };

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/campaigns/${id}`);
        setCampaign(response.data);
        if (response.data.visuals && response.data.visuals.length > 0) {
          setSelectedImage(response.data.visuals[0]);
        }
      } catch (error) {
        console.error('Error fetching campaign details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaignDetails();
  }, [id]);

  const handleInvest = async (e) => {
    if (e) e.preventDefault();

    // Validate investment amount
    if (parseInt(investmentAmount, 10) < parseInt(campaign.minInvestment, 10)) {
      alert(`Minimum ${campaign.minInvestment} required`);
      return;
    }
    const raised = parseInt(campaign.raisedAmount, 10);
    const goal = parseInt(campaign.fundingGoal, 10);
    const invest = parseInt(investmentAmount, 10);
    if (raised + invest > goal) {
      alert(`This amount exceeds the campaign goal of ${goal}`);
      return;
    }

    // Start investing loader
    setInvesting(true);

    try {
      await axios.put(`http://localhost:5000/api/campaigns/${id}/raisedAmount`, {
        amount: parseFloat(investmentAmount),
        userId: id,
        name: campaign.campaignTitle,
      });
      await axios.post(
        `http://localhost:5000/api/campaigns/${id}/investment`,
        { amount: parseFloat(investmentAmount) },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      toast.success('Investment successful!');
      setInvestmentAmount('');
      setIsInvestModalOpen(true); // Show confirmation modal
    } catch (error) {
      console.error('Error investing:', error);
      toast.error(error.response?.data?.message || 'Investment failed');
      alert('Investment failed!');
    } finally {
      // End investing loader
      setInvesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full"
          />
        </div>
      ) : campaign ? (
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-24 relative">
            <div className="relative h-[600px] group">
              <motion.img 
                src={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="h-full w-full object-cover rounded-[40px] transition-transform group-hover:scale-95"
              />
              <div className="absolute bottom-6 left-6 flex gap-3">
                {campaign.visuals?.map((visual, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(visual)}
                    className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImage === visual 
                        ? 'border-green-500 scale-110' 
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    <img src={visual} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-24 h-fit space-y-8">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/90 p-8 rounded-3xl border border-gray-200 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Leaf className="w-8 h-8 text-green-500" />
                  <h1 className="text-4xl font-bold tracking-tight">{campaign.campaignTitle}</h1>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-200 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-green-500 mb-2">
                        <Coins className="w-5 h-5" />
                        <span className="font-medium">Progress</span>
                      </div>
                      <div className="h-2 bg-gray-300 rounded-full">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((campaign.raisedAmount / campaign.fundingGoal) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-sm">
                        <span>${campaign.raisedAmount}</span>
                        <span>${campaign.fundingGoal}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-200 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CircleDollarSign className="w-5 h-5 text-green-500" />
                        <span className="text-sm">Minimum</span>
                      </div>
                      <div className="text-2xl font-bold">${campaign.minInvestment}</div>
                    </div>
                    <div className="bg-gray-200 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarDays className="w-5 h-5 text-green-500" />
                        <span className="text-sm">Days Left</span>
                      </div>
                      <div className="text-2xl font-bold">
                        {Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 3600 * 24))}
                      </div>
                    </div>
                  </div>

                  {campaign.raisedAmount < campaign.fundingGoal ? (
                    <motion.form 
                      onSubmit={handleInvest}
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="relative">
                        <input
                          type="number"
                          value={investmentAmount}
                          onChange={(e) => setInvestmentAmount(e.target.value)}
                          placeholder="Investment amount"
                          className="w-full pl-12 pr-6 py-4 bg-gray-200 border-2 border-gray-300 rounded-xl focus:border-green-400 focus:ring-0"
                        />
                        <CircleDollarSign className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                      </div>
                      <button
                        type="submit"
                        disabled={investing}
                        className={`w-full py-4 rounded-xl font-bold transition-transform ${
                          investing
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-500 to-green-600 hover:scale-105'
                        }`}
                      >
                        {investing ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="h-6 w-6 mx-auto border-2 border-t-transparent border-white rounded-full"
                          />
                        ) : (
                          'Commit Investment'
                        )}
                      </button>
                    </motion.form>
                  ) : (
                    <div className="p-4 bg-green-100 border border-green-200 rounded-xl text-center">
                      <span className="text-green-500">Campaign Fully Funded</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="grid lg:grid-cols-3 gap-8 mb-24">
            <div className="lg:col-span-2 space-y-12">
              <motion.section 
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold">Campaign Story</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {campaign.description}
                </p>
              </motion.section>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div 
                  className="bg-white/90 p-8 rounded-3xl border border-gray-200 shadow-sm"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                >
                  <h3 className="text-xl font-bold mb-6">Farmer Profile</h3>
                  <div className="space-y-4">
                    <DetailItem icon="👨🌾" title="Name" value={campaign.farmerName} />
                    <DetailItem icon="📍" title="Location" value={campaign.farmLocation} />
                    <DetailItem icon="📞" title="Contact" value={campaign.phoneNumber} />
                    <DetailItem icon="📧" title="Email" value={campaign.email} />
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-white/90 p-8 rounded-3xl border border-gray-200 shadow-sm"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                >
                  <h3 className="text-xl font-bold mb-6">Farm Details</h3>
                  <div className="space-y-4">
                    <DetailItem icon="🏷️" title="Farm Name" value={campaign.farmName} />
                    <DetailItem icon="📏" title="Size" value={campaign.farmSize} />
                    <DetailItem icon="🌱" title="Crops" value={campaign.cropTypes} />
                    <DetailItem icon="🔧" title="Methods" value={campaign.farmingMethods} />
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <motion.div 
                className="sticky top-24 space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-white/90 p-8 rounded-3xl border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold mb-6">Key Metrics</h3>
                  <div className="space-y-4">
                    <MetricItem 
                      title="Expected Returns"
                      value={campaign.expectedReturns}
                      color="text-green-500"
                    />
                    <MetricItem 
                      title="Fund Usage"
                      value={campaign.fundUsage}
                      color="text-amber-500"
                    />
                    <MetricItem 
                      title="Impact Metrics"
                      value={campaign.impactMetrics}
                      color="text-sky-500"
                    />
                  </div>
                </div>

                <div className="bg-white/90 p-8 rounded-3xl border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold mb-6">Timeline</h3>
                  <div className="space-y-4">
                    <TimelineItem 
                      date={new Date(campaign.startDate)}
                      title="Campaign Launch"
                    />
                    <TimelineItem 
                      date={new Date(campaign.endDate)}
                      title="Funding Deadline"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold">Campaign Not Found</div>
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 mx-auto text-green-500 hover:text-green-400"
            >
              <ArrowUpRight className="w-5 h-5" />
              Return to Marketplace
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ icon, title, value }) => (
  <div className="flex items-start gap-4">
    <span className="text-2xl">{icon}</span>
    <div>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="font-medium">{value}</div>
    </div>
  </div>
);

const MetricItem = ({ title, value, color }) => (
  <div className="border-l-2 border-green-300 pl-4">
    <div className="text-sm text-gray-500">{title}</div>
    <div className={`font-bold ${color}`}>{value}</div>
  </div>
);

const TimelineItem = ({ date, title }) => (
  <div className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-green-500 before:rounded-full">
    <div className="text-sm font-medium">{title}</div>
    <div className="text-sm text-gray-500">
      {date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })}
    </div>
  </div>
);

export default CampaignDetails;
