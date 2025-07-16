import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Leaf, Coins, CalendarDays, MapPin, User, Crop, Clock, BarChart, Wallet, Phone, Mail, ShieldAlert, BookOpen
} from 'lucide-react';
import { useSelector } from 'react-redux';

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const endpoint = useSelector((state) => state.endpoint.endpoint);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/campaigns/${id}`);
        setCampaign(response.data);
        // Ensure visuals array is not empty before setting selected image
        if (response.data.visuals && response.data.visuals.length === 0) {
            // Add a placeholder visual if none exist
            response.data.visuals.push({ url: 'https://via.placeholder.com/600x400.png?text=No+Image+Provided', public_id: 'placeholder' });
        }
        setSelectedImage(0); // Default to the first image
      } catch (error) {
        console.error('Error fetching campaign details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaignDetails();
  }, [id, endpoint]);

  const handleInvestNow = () => {
    navigate(`/campaign/${id}/invest`, { state: { campaign } });
  };

  const handleContactUs = () => {
    navigate('/contact', { state: { campaignId: id, campaignTitle: campaign.campaignTitle } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-emerald-50 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-4 border-emerald-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center bg-gradient-to-b from-emerald-50 to-white">
        <div>
          <h1 className="text-3xl font-bold text-emerald-800">Campaign Not Found</h1>
          <p className="mt-2 text-emerald-600">The campaign you're looking for might have been removed or does not exist.</p>
        </div>
      </div>
    );
  }

  // Safely calculate days remaining
  const daysRemaining = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 3600 * 24));

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-w-16 aspect-h-12 rounded-3xl overflow-hidden shadow-xl">
              <img
                src={campaign.visuals[selectedImage]?.url}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                alt="Main campaign visual"
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {campaign.visuals.map((visual, index) => (
                <button
                  key={visual.public_id || index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index 
                      ? 'border-emerald-600 scale-110 shadow-md'
                      : 'border-transparent hover:border-emerald-400'
                    }`}
                >
                  <img src={visual.url} className="w-full h-full object-cover" alt={`Campaign visual ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Campaign Details */}
          <div className="space-y-8">
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-100">
              <div className="flex items-center gap-3 mb-6">
                <Leaf className="w-8 h-8 text-emerald-600" />
                <h1 className="text-3xl font-bold text-emerald-900">{campaign.campaignTitle}</h1>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-emerald-700">Funding Progress</span>
                    <span className="text-emerald-600">₹{campaign.raisedAmount.toLocaleString()} raised of ₹{campaign.fundingGoal.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 h-3 bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${Math.min((campaign.raisedAmount / campaign.fundingGoal) * 100, 100)}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-1"><Coins className="w-5 h-5 text-emerald-600" /><span className="text-sm font-medium text-emerald-700">Min. Investment</span></div>
                    <div className="text-2xl font-bold text-emerald-900">₹{campaign.minInvestment.toLocaleString()}</div>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-1"><CalendarDays className="w-5 h-5 text-emerald-600" /><span className="text-sm font-medium text-emerald-700">Days Remaining</span></div>
                    <div className="text-2xl font-bold text-emerald-900">{daysRemaining > 0 ? daysRemaining : 'Ended'}</div>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={handleInvestNow} className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled={daysRemaining <= 0}>Invest Now</button>
                  <button onClick={handleContactUs} className="flex-1 py-4 bg-white border-2 border-emerald-600 text-emerald-600 font-semibold rounded-xl transition-all transform hover:scale-[1.02] shadow-lg">Contact Us</button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <ContentSection icon={<BookOpen />} title="Campaign Story">
              <p className="text-emerald-800 leading-relaxed whitespace-pre-wrap">{campaign.story || 'No story available.'}</p>
            </ContentSection>
            
            <div className="grid md:grid-cols-2 gap-8">
              <ContentSection icon={<User />} title="Farmer Profile">
                 {/* FIX: Using populated userId object */}
                 <div className="flex items-center gap-4 mb-4">
                    <img src={campaign.userId?.profilePicture?.url || 'https://via.placeholder.com/80'} alt={campaign.userId?.name} className="w-20 h-20 rounded-full object-cover border-2 border-emerald-200" />
                    <div>
                        <DetailItem title="Name" value={campaign.userId?.name} />
                        <DetailItem title="Email" value={campaign.userId?.email} />
                    </div>
                 </div>
                 <DetailItem icon={<MapPin className="w-5 h-5 text-emerald-600" />} title="Location" value={campaign.farmLocation} />
                 <DetailItem icon={<Phone className="w-5 h-5 text-emerald-600" />} title="Contact" value={campaign.userId?.phone} />
              </ContentSection>

              <ContentSection icon={<Crop />} title="Farm Details">
                 {/* FIX: Handling new structured data */}
                <DetailItem icon={<span className="text-emerald-600">🏷️</span>} title="Farm Name" value={campaign.farmName} />
                <DetailItem icon={<span className="text-emerald-600">📏</span>} title="Size" value={`${campaign.farmSize?.value} ${campaign.farmSize?.unit}`} />
                <DetailItem icon={<Leaf className="w-5 h-5 text-emerald-600" />} title="Crops" value={Array.isArray(campaign.cropTypes) ? campaign.cropTypes.join(', ') : campaign.cropTypes} />
                <DetailItem icon={<span className="text-emerald-600">🌾</span>} title="Methods" value={campaign.farmingMethods} />
              </ContentSection>
            </div>
          </div>
          
          <div className="lg:col-span-1 space-y-8">
            <ContentSection icon={<BarChart />} title="Key Metrics">
              {/* FIX: Displaying structured returns */}
              <div className="p-4 bg-emerald-50 rounded-xl">
                <div className="text-sm font-medium text-emerald-600 mb-1">Expected Returns</div>
                <div className="text-lg font-bold text-emerald-900">{campaign.expectedReturns?.min}% - {campaign.expectedReturns?.max}%</div>
                <p className="text-xs text-emerald-700 mt-1">{campaign.expectedReturns?.description}</p>
              </div>
              <MetricItem title="Fund Usage" value={campaign.fundUsage} icon={<Wallet className="w-5 h-5 text-emerald-600" />} />
              <MetricItem title="Impact Metrics" value={campaign.impactMetrics} icon={<span className="text-emerald-600">🌍</span>} />
            </ContentSection>
            
            {/* NEW: Risk Factors Section */}
            <ContentSection icon={<ShieldAlert />} title="Risk Factors">
                <p className="text-sm text-emerald-800 leading-relaxed bg-amber-50 p-4 rounded-lg border border-amber-200">{campaign.riskFactors || 'No risks specified.'}</p>
            </ContentSection>

            <ContentSection icon={<Clock />} title="Timeline">
                <TimelineItem date={new Date(campaign.startDate)} title="Campaign Start" isFirst />
                <TimelineItem date={new Date(campaign.endDate)} title="Funding Deadline" isLast />
            </ContentSection>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const ContentSection = ({ icon, title, children }) => (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-white rounded-3xl p-8 shadow-xl border border-emerald-100">
        <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">{icon}{title}</h3>
        <div className="space-y-4">{children}</div>
    </motion.section>
);

const DetailItem = ({ icon, title, value }) => (
  <div className="flex items-start gap-3">
    {icon && <div className="mt-1 flex-shrink-0">{icon}</div>}
    <div>
      <div className="text-sm font-medium text-emerald-600">{title}</div>
      <div className="text-md text-emerald-900 font-medium">{value || 'N/A'}</div>
    </div>
  </div>
);

const MetricItem = ({ title, value, icon }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 mt-1">{icon}</div>
    <div>
      <div className="text-sm font-medium text-emerald-600">{title}</div>
      <div className="text-md font-semibold text-emerald-900">{value}</div>
    </div>
  </div>
);

const TimelineItem = ({ date, title, isFirst, isLast }) => (
    <div className="relative pl-8">
        {!isFirst && <div className="absolute left-[7px] -top-4 h-full w-0.5 bg-emerald-200" />}
        <div className="absolute left-0 top-1 w-4 h-4 bg-emerald-600 rounded-full border-2 border-white shadow-sm" />
        <div className="text-md font-medium text-emerald-900">{title}</div>
        <div className="text-sm text-emerald-600">{date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
    </div>
);

export default CampaignDetails;