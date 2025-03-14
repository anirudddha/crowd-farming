import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Leaf, Coins, CalendarDays, MapPin, User, Crop, Clock, BarChart, Wallet, Phone, Mail 
} from 'lucide-react';
import toast from 'react-hot-toast';

const CampaignDetails = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [investing, setInvesting] = useState(false);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/campaigns/${id}`);
        setCampaign(response.data);
      } catch (error) {
        console.error('Error fetching campaign details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaignDetails();
  }, [id]);

  const handleInvest = async (e) => {
    e.preventDefault();

    // Validate investment amount
    if (parseInt(investmentAmount, 10) < parseInt(campaign.minInvestment, 10)) {
      toast.error(`Minimum investment of ₹${campaign.minInvestment} is required`);
      return;
    }
    const raised = parseInt(campaign.raisedAmount, 10);
    const goal = parseInt(campaign.fundingGoal, 10);
    const invest = parseInt(investmentAmount, 10);
    if (raised + invest > goal) {
      toast.error(`This amount exceeds the campaign goal of ₹${campaign.fundingGoal}`);
      return;
    }

    // Start investing loader
    setInvesting(true);

    try {
      // Update raised amount in the campaign
      await axios.put(`http://localhost:5000/api/campaigns/${id}/raisedAmount`, {
        amount: parseFloat(investmentAmount),
        userId: id,
        name: campaign.campaignTitle,
      });
      // Log the investment in the system
      await axios.post(
        `http://localhost:5000/api/campaigns/${id}/investment`,
        { amount: parseFloat(investmentAmount) },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      toast.success('Investment successful!');
      // Optionally, update the campaign's raised amount in state
      setCampaign((prev) => ({
        ...prev,
        raisedAmount: parseFloat(prev.raisedAmount) + parseFloat(investmentAmount),
      }));
      setInvestmentAmount('');
      setIsInvestModalOpen(true); // if you want to show a modal on success
    } catch (error) {
      console.error('Error investing:', error);
      toast.error(error.response?.data?.message || 'Investment failed');
    } finally {
      // End investing loader
      setInvesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-16 w-16 border-4 border-emerald-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold text-emerald-800">Campaign Not Found</h1>
          <p className="text-emerald-600">The campaign you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid lg:grid-cols-2 gap-12"
        >
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-xl">
              <img 
                src={campaign.visuals[selectedImage]} 
                className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                alt="Main campaign visual"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {campaign.visuals.map((visual, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-24 h-24 mt-2 ml-2 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-emerald-600 scale-110' 
                      : 'border-gray-200 hover:border-emerald-400'
                  }`}
                >
                  <img 
                    src={visual} 
                    className="w-full h-full object-cover" 
                    alt={`Campaign visual ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Campaign Details */}
          <div className="space-y-8">
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <Leaf className="w-8 h-8 text-emerald-600" />
                <h1 className="text-3xl font-bold text-emerald-900">{campaign.campaignTitle}</h1>
              </div>

              {/* Progress Bar */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-700">Funding Progress</span>
                    <span className="text-sm text-emerald-600">
                    ₹{campaign.raisedAmount} raised of ₹{campaign.fundingGoal}
                    </span>
                  </div>
                  <div className="h-3 bg-emerald-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                      style={{ width: `${Math.min((campaign.raisedAmount / campaign.fundingGoal) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Coins className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700">Minimum Investment</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-900">₹{campaign.minInvestment}</div>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarDays className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700">Days Remaining</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-900">
                      {Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 3600 * 24))}
                    </div>
                  </div>
                </div>

                {/* Investment Form */}
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
                        placeholder="Enter investment amount"
                        className="w-full pl-12 pr-6 py-4 bg-white border-2 border-emerald-100 rounded-xl focus:border-emerald-500 focus:ring-0 text-emerald-900"
                      />
                      <span className="absolute left-4 top-4 text-emerald-600">₹</span>
                    </div>
                    <button
                      type="submit" 
                      disabled={investing}
                      className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
                    >
                      {investing ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="h-6 w-6 mx-auto border-2 border-t-transparent border-white rounded-full"
                        />
                      ) : (
                        'Invest Now'
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <div className="p-4 bg-emerald-100 border border-emerald-200 rounded-xl text-center">
                    <span className="text-emerald-700 font-medium">🎉 Campaign Fully Funded!</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Campaign Story */}
            <motion.section 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-100"
            >
              <h2 className="text-2xl font-bold text-emerald-900 mb-6">Campaign Story</h2>
              <p className="text-emerald-700 leading-relaxed">
                {campaign.description || 'No description available'}
              </p>
            </motion.section>

            {/* Farmer & Farm Details */}
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-100"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
              >
                <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-emerald-600" />
                  Farmer Profile
                </h3>
                <div className="space-y-4">
                  <DetailItem icon={<User className="w-5 h-5 text-emerald-600" />} title="Name" value={campaign.farmerName} />
                  <DetailItem icon={<MapPin className="w-5 h-5 text-emerald-600" />} title="Location" value={campaign.farmLocation} />
                  <DetailItem icon={<Phone className="w-5 h-5 text-emerald-600" />} title="Contact" value={campaign.phoneNumber} />
                  <DetailItem icon={<Mail className="w-5 h-5 text-emerald-600" />} title="Email" value={campaign.email} />
                </div>
              </motion.div>

              <motion.div 
                className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-100"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
              >
                <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                  <Crop className="w-6 h-6 text-emerald-600" />
                  Farm Details
                </h3>
                <div className="space-y-4">
                  <DetailItem icon={<span className="text-emerald-600">🏷️</span>} title="Farm Name" value={campaign.farmName} />
                  <DetailItem icon={<span className="text-emerald-600">📏</span>} title="Size" value={campaign.farmSize} />
                  <DetailItem icon={<Leaf className="w-5 h-5 text-emerald-600" />} title="Crops" value={campaign.cropTypes} />
                  <DetailItem icon={<span className="text-emerald-600">🌾</span>} title="Methods" value={campaign.farmingMethods} />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Key Metrics */}
            <motion.div 
              className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                <BarChart className="w-6 h-6 text-emerald-600" />
                Key Metrics
              </h3>
              <div className="space-y-4">
                <MetricItem 
                  title="Expected Returns"
                  value={campaign.expectedReturns}
                  icon={<span className="text-emerald-600">📈</span>}
                />
                <MetricItem 
                  title="Fund Usage"
                  value={campaign.fundUsage}
                  icon={<Wallet className="w-5 h-5 text-emerald-600" />}
                />
                <MetricItem 
                  title="Impact Metrics"
                  value={campaign.impactMetrics}
                  icon={<span className="text-emerald-600">🌍</span>}
                />
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div 
              className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-emerald-600" />
                Timeline
              </h3>
              <div className="space-y-4">
                <TimelineItem 
                  date={new Date(campaign.startDate)}
                  title="Campaign Launch"
                  isFirst
                />
                <TimelineItem 
                  date={new Date(campaign.endDate)}
                  title="Funding Deadline"
                  isLast
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, title, value }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1">{icon}</div>
    <div>
      <div className="text-sm font-medium text-emerald-600">{title}</div>
      <div className="text-emerald-900">{value || 'N/A'}</div>
    </div>
  </div>
);

const MetricItem = ({ title, value, icon }) => (
  <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <div className="text-sm font-medium text-emerald-600">{title}</div>
      <div className="text-lg font-semibold text-emerald-900">{value}</div>
    </div>
  </div>
);

const TimelineItem = ({ date, title, isFirst, isLast }) => (
  <div className="relative pl-6">
    {!isFirst && <div className="absolute left-[13px] top-0 h-full w-0.5 bg-emerald-100" />}
    <div className="flex items-center gap-3">
      <div className="absolute left-0 top-2 w-3 h-3 bg-emerald-600 rounded-full border-2 border-white shadow" />
      <div>
        <div className="text-sm font-medium text-emerald-900">{title}</div>
        <div className="text-sm text-emerald-600">
          {date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>
    </div>
    {isLast && <div className="mt-4" />}
  </div>
);

export default CampaignDetails;
