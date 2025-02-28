import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

const CreateCampaign = () => {
  // State declarations
  const [base64Strings, setBase64Strings] = useState([]);
  const [pendingPermission, setPendingPermission] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profilePicture: '',
    address: '',
  });

  // Request verification if account not active
  const handleRequest = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/sending-request', {
        userId: profileData._id,
        email: profileData.email,
      });
      alert("Request has been sent. We will contact you soon");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('You already sent a request!');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/user-profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    farmerName: '',
    phoneNumber: '',
    email: '',
    farmName: '',
    farmLocation: '',
    farmSize: '',
    campaignTitle: '',
    fundingGoal: '',
    minInvestment: '',
    expectedReturns: '',
    cropTypes: '',
    farmingMethods: '',
    startDate: '',
    endDate: '',
    fundUsage: '',
    impactMetrics: '',
    visuals: [],
  });

  // Update form state for each input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file uploads and convert them to Base64 strings
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const promises = files.map(file => {
      const reader = new FileReader();
      return new Promise(resolve => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then(results => {
      setBase64Strings(results);
      setFormData(prev => ({
        ...prev,
        visuals: results,
      }));
    });
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Ensure visuals is set from base64Strings
    formData.visuals = base64Strings;
    try {
      await axios.post('http://localhost:5000/api/campaigns', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Campaign created!');
      // Reset form on success
      setFormData({
        farmerName: '',
        phoneNumber: '',
        email: '',
        farmName: '',
        farmLocation: '',
        farmSize: '',
        campaignTitle: '',
        fundingGoal: '',
        minInvestment: '',
        expectedReturns: '',
        cropTypes: '',
        farmingMethods: '',
        startDate: '',
        endDate: '',
        fundUsage: '',
        impactMetrics: '',
        visuals: [],
      });
      setBase64Strings([]);
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      {loading && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader className="w-16 h-16 text-emerald-600" />
        </div>
      )}

      {profileData.active === "true" ? (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-8">
            <h1 className="text-3xl font-bold text-white text-center">
              Create Farm Campaign
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {/* Farmer Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                Farmer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input
                  type="text"
                  name="farmerName"
                  placeholder="Farmer's Name"
                  value={formData.farmerName}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </section>

            {/* Farm Details */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                Farm Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input
                  type="text"
                  name="farmName"
                  placeholder="Farm Name"
                  value={formData.farmName}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  name="farmLocation"
                  placeholder="Farm Location"
                  value={formData.farmLocation}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  name="farmSize"
                  placeholder="Farm Size (acreage or sq ft)"
                  value={formData.farmSize}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </section>

            {/* Campaign Information */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                Campaign Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="campaignTitle"
                  placeholder="Campaign Title"
                  value={formData.campaignTitle}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  name="fundingGoal"
                  placeholder="Funding Goal ($)"
                  value={formData.fundingGoal}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="number"
                  name="minInvestment"
                  placeholder="Minimum Investment ($)"
                  value={formData.minInvestment}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <textarea
                  name="expectedReturns"
                  placeholder="Expected Returns (%)"
                  value={formData.expectedReturns}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>
            </section>

            {/* Farming Practices */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                Farming Practices
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <textarea
                  name="cropTypes"
                  placeholder="Crop Types"
                  value={formData.cropTypes}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none h-24"
                />
                <select
                  name="farmingMethods"
                  value={formData.farmingMethods}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="" disabled>
                    Select Farming Method
                  </option>
                  <option value="Conventional">Conventional</option>
                  <option value="Organic">Organic</option>
                  <option value="Sustainable">Sustainable</option>
                </select>
              </div>
            </section>

            {/* Project Timeline */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                Project Timeline
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </section>

            {/* Usage of Funds */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                Usage of Funds
              </h2>
              <textarea
                name="fundUsage"
                placeholder="Detailed breakdown of fund usage"
                value={formData.fundUsage}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none h-24"
              />
            </section>

            {/* Impact Metrics */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                Impact Metrics
              </h2>
              <textarea
                name="impactMetrics"
                placeholder="Impact Metrics"
                value={formData.impactMetrics}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none h-24"
              />
            </section>

            {/* Upload Visuals */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
                Upload Visuals
              </h2>
              <div className="border-2 border-dashed border-emerald-200 rounded-xl p-8 text-center">
                <input
                  type="file"
                  name="visuals"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-block px-8 py-3 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                >
                  Choose Files
                </label>
                <p className="mt-4 text-sm text-emerald-600">
                  {base64Strings.length} file{base64Strings.length !== 1 && "s"} selected
                </p>
              </div>
            </section>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
              >
                Create Campaign
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="mb-6 text-emerald-600">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">
            Account Verification Required
          </h2>
          <p className="text-emerald-600 mb-8">
            Please verify your farming account with 5 Acre Organics before creating campaigns.
          </p>
          <button
            onClick={handleRequest}
            disabled={pendingPermission}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              pendingPermission
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white transform hover:scale-105'
            }`}
          >
            {pendingPermission ? 'Request Pending' : 'Send Verification Request'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateCampaign;
