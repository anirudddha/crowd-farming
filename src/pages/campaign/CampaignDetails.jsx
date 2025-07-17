import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Coins, CalendarDays, MapPin, User, Crop, Clock, Wallet, Phone, ShieldCheck, ShieldAlert, BookOpen, TrendingUp, Target, Globe, CheckCircle2, Sprout
} from 'lucide-react';
import { useSelector } from 'react-redux';

// Main Campaign Details Component
const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('story');

  const endpoint = useSelector((state) => state.endpoint.endpoint);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${endpoint}/campaigns/${id}`);
        const campaignData = response.data;
        
        if (!campaignData.visuals || campaignData.visuals.length === 0) {
            campaignData.visuals = [{ url: 'https://via.placeholder.com/800x600.png?text=No+Image+Provided', public_id: 'placeholder' }];
        }
        
        setCampaign(campaignData);
        setSelectedImage(0);
      } catch (error) {
        console.error('Error fetching campaign details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaignDetails();
  }, [id, endpoint]);

  const handleInvestNow = () => navigate(`/campaign/${id}/invest`, { state: { campaign } });
  const handleContactUs = () => navigate('/contact', { state: { campaignId: campaign._id, campaignTitle: campaign.campaignTitle } });

  if (loading) return <LoadingSpinner />;
  if (!campaign) return <NotFound />;

  const daysRemaining = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 3600 * 24));
  const progressPercentage = Math.min((campaign.raisedAmount / campaign.fundingGoal) * 100, 100);

  const tabs = [
    { id: 'story', label: 'Story', icon: <BookOpen size={18} /> },
    { id: 'allocation', label: 'Fund Allocation', icon: <Wallet size={18} /> },
    { id: 'farmer', label: 'Farmer Profile', icon: <User size={18} /> },
    { id: 'risks', label: 'Risks & Mitigation', icon: <ShieldAlert size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ImageGallery campaign={campaign} selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
              <TabbedContent tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} campaign={campaign} />
            </div>
            
            <ImpactMetricsCard campaign={campaign} />
            <ProjectTimeline campaign={campaign} />

          </div>

          {/* Sticky Investment Hub Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <InvestmentCard 
                campaign={campaign} 
                daysRemaining={daysRemaining} 
                progressPercentage={progressPercentage}
                onInvestNow={handleInvestNow}
                onContactUs={handleContactUs}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Child Components ---

const LoadingSpinner = () => (<div className="min-h-screen flex items-center justify-center bg-slate-50"><motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="h-16 w-16 border-4 border-emerald-500 border-t-transparent rounded-full"/></div>);
const NotFound = () => (<div className="min-h-screen flex items-center justify-center text-center bg-slate-50"><div><h1 className="text-3xl font-bold text-slate-800">Campaign Not Found</h1><p className="mt-2 text-slate-600">This campaign might have been removed or does not exist.</p></div></div>);

const StatusBadge = ({ status }) => {
    const statusStyles = {
      Active: 'bg-green-100 text-green-800 ring-green-600/20',
      Ended: 'bg-slate-100 text-slate-800 ring-slate-600/20',
      'Fully Funded': 'bg-blue-100 text-blue-800 ring-blue-600/20',
    };
    const style = statusStyles[status] || statusStyles['Ended'];
    return (<span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap ring-1 ring-inset ${style}`}>{status}</span>);
};

const ImageGallery = ({ campaign, selectedImage, setSelectedImage }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="space-y-3">
        <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200">
          <img src={campaign.visuals[selectedImage]?.url} className="w-full h-full object-cover" alt="Main campaign visual"/>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 p-2">
          {campaign.visuals.map((visual, index) => (
            <button key={visual.public_id || index} onClick={() => setSelectedImage(index)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-emerald-500 scale-105 shadow-md' : 'border-transparent hover:border-emerald-300'}`}>
              <img src={visual.url} className="w-full h-full object-cover" alt={`Campaign thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
);

const TabbedContent = ({ tabs, activeTab, setActiveTab, campaign }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 flex flex-col">
      <div className="border-b border-slate-200 mb-6">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-grow overflow-y-auto pr-2 max-h-[350px] lg:max-h-full">
        {activeTab === 'story' && <ContentBlock content={campaign.story} />}
        {activeTab === 'allocation' && <FundAllocation content={campaign.fundUsage} />}
        {activeTab === 'farmer' && <FarmerProfile campaign={campaign} />}
        {activeTab === 'risks' && <RiskFactors content={campaign.riskFactors} />}
      </div>
    </motion.div>
);

const InvestmentCard = ({ campaign, daysRemaining, progressPercentage, onInvestNow, onContactUs }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-6">
        <div className="flex justify-between items-start gap-2">
            <h1 className="text-2xl font-bold text-slate-800 flex-1">{campaign.campaignTitle}</h1>
            <StatusBadge status={campaign.status} />
        </div>
        <p className="text-sm text-slate-500 -mt-4 flex items-center gap-2"><MapPin size={14} />{campaign.farmName}, {campaign.farmLocation}</p>
        <div>
            <div className="flex justify-between items-end mb-1"><span className="text-lg font-bold text-emerald-600">₹{campaign.raisedAmount.toLocaleString()}</span><span className="text-sm font-medium text-slate-500">of ₹{campaign.fundingGoal.toLocaleString()}</span></div>
            <div className="w-full bg-slate-200 rounded-full h-2.5"><div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div></div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
            <MetricBox icon={<CalendarDays className="text-emerald-500" />} value={daysRemaining > 0 ? daysRemaining : 'Ended'} label="Days Remaining" />
            <MetricBox icon={<Coins className="text-emerald-500" />} value={`₹${campaign.minInvestment.toLocaleString()}`} label="Min. Investment" />
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
             <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-700"><TrendingUp size={16} />Expected Returns</div>
             <div className="text-2xl font-bold text-emerald-900 mt-1">{campaign.expectedReturns?.min}% - {campaign.expectedReturns?.max}%</div>
             <p className="text-xs text-emerald-600 mt-1">{campaign.expectedReturns?.description}</p>
        </div>
        <div className="space-y-3 pt-2">
            <button onClick={onInvestNow} disabled={daysRemaining <= 0 || campaign.status !== 'Active'} className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:saturate-50">Invest Now</button>
            <button onClick={onContactUs} className="w-full py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg transition-all transform hover:scale-[1.02] hover:bg-slate-50">Contact Us</button>
        </div>
        <p className="text-xs text-center text-slate-400">Secure investment powered by AgroFund.</p>
    </motion.div>
);
  
const MetricBox = ({ icon, value, label }) => (<div className="bg-slate-100 p-3 rounded-lg"><div className="flex justify-center items-center mb-1">{icon}</div><div className="text-xl font-bold text-slate-800">{value}</div><div className="text-xs font-medium text-slate-500">{label}</div></div>);
const ContentBlock = ({ content }) => (<p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{content || 'No information available.'}</p>);
  
const FundAllocation = ({ content }) => {
    const allocations = content ? content.split('. ').filter(item => item) : [];
    return (<div className="space-y-4">{allocations.length > 0 ? (allocations.map((item, index) => (<div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"><div className="flex-shrink-0 mt-1 w-8 h-6 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full font-bold text-sm">{item.match(/\d+/)?.[0]}%</div><p className="text-slate-700">{item.replace(/\d+% for /, '')}</p></div>))) : <p className="text-slate-500">Fund usage details not specified.</p>}</div>);
};
  
const FarmerProfile = ({ campaign }) => (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img src={campaign.userId?.profilePicture?.url || 'https://via.placeholder.com/96'} alt={campaign.userId?.name} className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100" />
            <div>
                <h4 className="text-xl font-bold text-slate-800">{campaign.userId?.name || 'N/A'}</h4>
                <p className="text-slate-500">{campaign.userId?.email || 'N/A'}</p>
                {campaign.isVerified && (<span className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><ShieldCheck size={14} /> Verified Farmer</span>)}
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
             <DetailItem icon={<MapPin size={20} className="text-slate-500"/>} title="Farm Location" value={campaign.farmLocation} />
             <DetailItem icon={<Phone size={20} className="text-slate-500"/>} title="Contact" value={campaign.userId?.phone || 'N/A'} />
             <DetailItem icon={<Crop size={20} className="text-slate-500"/>} title="Crops" value={Array.isArray(campaign.cropTypes) ? campaign.cropTypes.join(', ') : 'N/A'} />
             <DetailItem icon={<Target size={20} className="text-slate-500"/>} title="Farm Size" value={`${campaign.farmSize?.value} ${campaign.farmSize?.unit}`} />
             <DetailItem icon={<Sprout size={20} className="text-slate-500"/>} title="Farming Methods" value={campaign.farmingMethods || 'N/A'} />
        </div>
    </div>
);
  
const RiskFactors = ({ content }) => (<div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg"><div className="flex items-start gap-3"><ShieldAlert className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" /><p className="text-sm text-amber-900 leading-relaxed">{content || 'No risks specified.'}</p></div></div>);
const DetailItem = ({ icon, title, value }) => (<div className="flex items-start gap-3"> <div className="flex-shrink-0 mt-1">{icon}</div><div><div className="text-sm font-medium text-slate-500">{title}</div><div className="text-md text-slate-800 font-semibold">{value || 'N/A'}</div></div></div>);

const ImpactMetricsCard = ({ campaign }) => {
    const metrics = campaign.impactMetrics ? campaign.impactMetrics.split('.').filter(m => m.trim() !== '') : [];
    if (metrics.length === 0) return null;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Globe size={20} /> Environmental & Social Impact</h3>
            <ul className="space-y-3">
                {metrics.map((metric, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{metric.trim()}.</span>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
};

const ProjectTimeline = ({ campaign }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Clock size={20} /> Project Timeline</h3>
        <div className="relative pl-8 space-y-8">
            <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-slate-200" />
            <TimelineItem date={new Date(campaign.startDate)} title="Campaign Start" />
            <TimelineItem date={new Date(campaign.endDate)} title="Funding Deadline" />
        </div>
    </motion.div>
);
  
const TimelineItem = ({ date, title }) => (<div className="relative"><div className="absolute left-[-29px] top-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white" /><div className="text-md font-semibold text-slate-700">{title}</div><div className="text-sm text-slate-500">{date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div></div>);
  
export default CampaignDetails;