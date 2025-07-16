import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Leaf, DollarSign, Calendar, AlertTriangle, Image, Info, User, Tractor, Sprout, UploadCloud } from 'lucide-react';
import Loader from '../../components/Loader';

// --- Reusable UI Components (unchanged) ---
const FormSection = ({ icon, title, subtitle, children }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
    <div className="flex items-start gap-4 mb-6 border-b border-gray-200 pb-4">
      <div className="flex-shrink-0 text-emerald-600 mt-1">{icon}</div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-md text-gray-500">{subtitle}</p>
      </div>
    </div>
    <div className="space-y-6">{children}</div>
  </div>
);

const InputGroup = ({ label, children }) => (
  <div>
    <label className="block text-md font-bold text-gray-800 mb-2">{label}</label>
    {children}
  </div>
);

// --- FIX: Initial state defined as a constant for easy reset ---
const initialFormData = {
  campaignTitle: '', story: '', farmName: '', farmLocation: '',
  farmSize: { value: '', unit: 'Acres' },
  fundingGoal: '', minInvestment: '',
  expectedReturns: { type: 'Percentage Range', min: '', max: '', description: '' },
  cropTypes: '', farmingMethods: 'Organic',
  startDate: '', endDate: '',
  fundUsage: '', impactMetrics: '', riskFactors: '',
  visuals: [],
};


const CreateCampaign = () => {
  const endpoint = useSelector((state) => state.endpoint.endpoint);

  const inputClasses = "block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base font-medium text-gray-900 shadow-sm transition-colors duration-200 ease-in-out placeholder:text-gray-400 hover:border-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200";

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${endpoint}/user-profile`, { headers: { Authorization: `Bearer ${token}` } });
        setProfileData(response.data);
      } catch (error) { toast.error("Could not load your profile data."); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [endpoint]);

  const handleRequest = async () => {
    setLoading(true);
    try {
      await axios.post(`${endpoint}/sending-request`, { userId: profileData._id, email: profileData.email });
      toast.success("Request sent successfully! We'll be in touch.");
    } catch (error) { toast.error(error.response?.data?.message || "An error occurred."); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, visuals: Array.from(e.target.files) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('campaignTitle', formData.campaignTitle);
    data.append('story', formData.story);
    data.append('farmName', formData.farmName);
    data.append('farmLocation', formData.farmLocation);
    data.append('fundingGoal', formData.fundingGoal);
    data.append('minInvestment', formData.minInvestment);
    data.append('cropTypes', formData.cropTypes);
    data.append('farmingMethods', formData.farmingMethods);
    data.append('startDate', formData.startDate);
    data.append('endDate', formData.endDate);
    data.append('fundUsage', formData.fundUsage);
    data.append('impactMetrics', formData.impactMetrics);
    data.append('riskFactors', formData.riskFactors);
    data.append('farmSizeValue', formData.farmSize.value);
    data.append('farmSizeUnit', formData.farmSize.unit);
    data.append('returnsType', formData.expectedReturns.type);
    data.append('returnsMin', formData.expectedReturns.min);
    data.append('returnsMax', formData.expectedReturns.max);
    data.append('returnsDescription', formData.expectedReturns.description);
    formData.visuals.forEach(file => data.append('visuals', file));

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${endpoint}/campaigns`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } });
      toast.success('Campaign submitted for review!');
      // --- FIX: Reset form state after successful submission ---
      setFormData(initialFormData);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create campaign. Please check all fields.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData) return <div className="fixed inset-0 bg-white z-50 flex items-center justify-center"><Loader /></div>;
  if (!profileData) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} theme="colored" />
      {loading && <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"><Loader /></div>}

      {profileData.active === "true" ? (
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">Create a New Farm Campaign</h1>
            <p className="mt-4 text-xl text-gray-600">Bring your agricultural project to life by filling out the details below.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column */}
              <div className="space-y-12">
                <FormSection icon={<Leaf size={32} />} title="Campaign Pitch" subtitle="Tell your story and define your project.">
                  <InputGroup label="Campaign Title"><input type="text" name="campaignTitle" value={formData.campaignTitle} onChange={handleChange} className={inputClasses} required /></InputGroup>
                  <InputGroup label="Your Story"><textarea name="story" value={formData.story} onChange={handleChange} className={`${inputClasses} min-h-[144px] resize-y`} required placeholder="Describe your mission, your farm, and what makes this project special." /></InputGroup>
                </FormSection>

                <FormSection icon={<DollarSign size={32} />} title="Financials" subtitle="Set your funding goals and investor returns.">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputGroup label="Funding Goal (₹)"><input type="number" name="fundingGoal" value={formData.fundingGoal} onChange={handleChange} className={inputClasses} required /></InputGroup>
                    <InputGroup label="Minimum Investment (₹)"><input type="number" name="minInvestment" value={formData.minInvestment} onChange={handleChange} className={inputClasses} required /></InputGroup>
                  </div>
                  <InputGroup label="Expected Returns">
                    <div className="p-4 border rounded-lg space-y-4 bg-white">
                      <select name="expectedReturns.type" value={formData.expectedReturns.type} onChange={handleChange} className={inputClasses}><option>Percentage Range</option><option>Fixed Multiple</option></select>
                      <div className="flex items-center gap-4">
                        <input type="number" name="expectedReturns.min" value={formData.expectedReturns.min} onChange={handleChange} placeholder="Min %" className={inputClasses} required />
                        <span className="text-gray-500">–</span>
                        <input type="number" name="expectedReturns.max" value={formData.expectedReturns.max} onChange={handleChange} placeholder="Max %" className={inputClasses} />
                      </div>
                      <textarea name="expectedReturns.description" value={formData.expectedReturns.description} onChange={handleChange} className={`${inputClasses} min-h-[80px] resize-y text-sm`} placeholder="Briefly describe how returns are calculated (e.g., based on market price)." required />
                    </div>
                  </InputGroup>
                </FormSection>
              </div>
              
              {/* Right Column */}
              <div className="space-y-12">
                <FormSection icon={<User size={32} />} title="Farmer & Farm Details" subtitle="Information about you and your land.">
                   <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <h4 className="font-semibold text-gray-700">Farmer Profile (from your account)</h4>
                      <p className="text-sm text-gray-600">Name: <span className="font-medium">{profileData.name}</span></p>
                      <p className="text-sm text-gray-600">Email: <span className="font-medium">{profileData.email}</span></p>
                   </div>
                  <InputGroup label="Farm Name"><input type="text" name="farmName" value={formData.farmName} onChange={handleChange} className={inputClasses} required /></InputGroup>
                  <InputGroup label="Farm Location"><input type="text" name="farmLocation" className={inputClasses} value={formData.farmLocation} onChange={handleChange} required placeholder="e.g., Villupuram District, Tamil Nadu" /></InputGroup>
                  <InputGroup label="Farm Size">
                    <div className="flex gap-4">
                      <input type="number" name="farmSize.value" value={formData.farmSize.value} onChange={handleChange} className={`${inputClasses} w-2/3`} required />
                      <select name="farmSize.unit" value={formData.farmSize.unit} onChange={handleChange} className={`${inputClasses} w-1/3`}><option>Acres</option><option>Hectares</option></select>
                    </div>
                  </InputGroup>
                </FormSection>

                <FormSection icon={<Tractor size={32} />} title="Agricultural Practices" subtitle="Details about your crops and methods.">
                  <InputGroup label="Crop Types (comma-separated)"><input type="text" name="cropTypes" value={formData.cropTypes} onChange={handleChange} className={inputClasses} required placeholder="e.g., Millet, Turmeric, Cotton" /></InputGroup>
                  <InputGroup label="Farming Methods"><select name="farmingMethods" value={formData.farmingMethods} onChange={handleChange} className={inputClasses}><option>Organic</option><option>Conventional</option><option>Sustainable</option><option>Permaculture</option><option>Biodynamic</option></select></InputGroup>
                </FormSection>

                <FormSection icon={<Calendar size={32} />} title="Timeline" subtitle="Key dates for your campaign.">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputGroup label="Project Start Date"><input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={inputClasses} required /></InputGroup>
                    <InputGroup label="Project End Date"><input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className={inputClasses} required /></InputGroup>
                  </div>
                </FormSection>
              </div>
            </div>

            <div className="space-y-12">
              <FormSection icon={<Info size={32} />} title="Operational Details" subtitle="Explain where the money goes and the impact it makes.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <InputGroup label="Usage of Funds"><textarea name="fundUsage" value={formData.fundUsage} onChange={handleChange} className={`${inputClasses} min-h-[144px] resize-y`} required placeholder="Detailed breakdown of how funds will be used (e.g., seeds, labor, equipment)." /></InputGroup>
                  <InputGroup label="Impact Metrics"><textarea name="impactMetrics" value={formData.impactMetrics} onChange={handleChange} className={`${inputClasses} min-h-[144px] resize-y`} required placeholder="e.g., Carbon sequestration, water saved, jobs created, community benefits." /></InputGroup>
                </div>
              </FormSection>

              <FormSection icon={<AlertTriangle size={32} />} title="Risk Factors" subtitle="Be transparent with your investors.">
                <InputGroup label="Potential Risks & Mitigation Plan"><textarea name="riskFactors" value={formData.riskFactors} onChange={handleChange} className={`${inputClasses} min-h-[144px] resize-y`} required placeholder="Describe potential risks (weather, pests, market) and the steps you will take to mitigate them." /></InputGroup>
              </FormSection>
              
              <FormSection icon={<Image size={32} />} title="Upload Visuals" subtitle="Showcase your farm with photos or videos.">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2 hover:text-emerald-500">
                      <span>Upload files</span>
                      <input type="file" name="visuals" multiple onChange={handleFileChange} className="sr-only" id="file-upload" accept="image/*,video/*" />
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-gray-600 mt-2">PNG, JPG, GIF up to 10MB</p>
                  {formData.visuals.length > 0 && <div className="mt-4 text-sm font-medium text-emerald-700">{formData.visuals.length} file(s) selected.</div>}
                </div>
              </FormSection>
            </div>
            
            <div className="pt-6">
              <button type="submit" className="w-full py-4 text-lg font-bold text-white bg-emerald-600 rounded-xl shadow-md transition-all transform hover:scale-[1.02] hover:shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300">
                Submit Campaign for Review
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-12 text-center">
            <Sprout className="w-16 h-16 mx-auto text-emerald-500 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Verification Required</h2>
            <p className="text-gray-600 mb-8">To ensure the quality and authenticity of our farm projects, we require all farmers to be verified. Please send a request to our team to get started.</p>
            <button onClick={handleRequest} className="px-8 py-3 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all transform hover:scale-105">Send Verification Request</button>
        </div>
      )}
    </div>
  );
};

export default CreateCampaign;