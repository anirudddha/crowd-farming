import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    _id: '',
    name: '',
    email: '',
    profilePicture: '',
    address: '',
  });
  const [preview, setPreview] = useState('');
  const [base64Image, setBase64Image] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/user-profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfileData(response.data);
        setPreview(response.data.profilePicture);
        setNewName(response.data.name);
        setNewAddress(response.data.address || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setBase64Image(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUpload = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/upload-profile-picture',
        { profilePicture: base64Image },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setProfileData(prev => ({ ...prev, profilePicture: response.data.profilePicture }));
      setBase64Image('');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setIsLoading(false);
    }
  }, [base64Image]);

  const handleNameSave = useCallback(async () => {
    setIsLoading(true);
    try {
      await axios.put('http://localhost:5000/api/editName', { name: newName, _id: profileData._id });
      setProfileData(prev => ({ ...prev, name: newName }));
      setIsEditingName(false);
    } catch (error) {
      console.error('Error saving name:', error);
    } finally {
      setIsLoading(false);
    }
  }, [newName, profileData._id]);

  const handleAddressSave = useCallback(async () => {
    setIsLoading(true);
    try {
      await axios.put('http://localhost:5000/api/editAddress', { address: newAddress, _id: profileData._id });
      setProfileData(prev => ({ ...prev, address: newAddress }));
      setIsEditingAddress(false);
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setIsLoading(false);
    }
  }, [newAddress, profileData._id]);

  const handleCancelNameEdit = useCallback(() => {
    setNewName(profileData.name);
    setIsEditingName(false);
  }, [profileData.name]);

  const handleCancelAddressEdit = useCallback(() => {
    setNewAddress(profileData.address || '');
    setIsEditingAddress(false);
  }, [profileData.address]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 py-8 px-4 sm:px-6 lg:px-8 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader className="w-16 h-16 text-emerald-600" />
        </div>
      )}

      <div className="max-w-4xl mx-auto transform transition-all duration-300">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl shadow-2xl p-8 mb-12 overflow-hidden">
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full" />

          <div className="flex flex-col items-center space-y-6 z-10 relative">
            <label className="relative group cursor-pointer transform hover:scale-105 transition-transform">
              <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg">
                <div className="p-1 bg-white rounded-full">
                  <img
                    className="w-32 h-32 rounded-full object-cover border-4 border-white"
                    src={preview || '/default-profile.png'}
                    alt="Profile"
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fa-solid fa-pen"></i>
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </label>

            {base64Image && (
              <button
                onClick={handleUpload}
                className="px-6 py-3 bg-white text-emerald-600 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold flex items-center gap-2"
              >
                <i className="fa-solid fa-check"></i>
                Upload New Photo
              </button>
            )}
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transition-all hover:shadow-2xl">
          <div className="space-y-8">
            {/* Name Section */}
            <div className="group relative">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-sm font-semibold text-emerald-600">FULL NAME</span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-2 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
              </div>

              {isEditingName ? (
                <div className="pt-4 flex gap-4">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 px-4 py-3 border-b-2 border-emerald-500 focus:outline-none text-xl font-semibold bg-gray-50 rounded-lg"
                    placeholder="Enter your name"
                  />
                  <button
                    onClick={handleNameSave}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelNameEdit}
                    className="px-6 py-3 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <h2 className="pt-4 text-2xl font-bold text-gray-800">{profileData.name}</h2>
              )}
            </div>

            {/* Email Section */}
            <div className="group">
              <div className="pb-2 border-b border-gray-100">
                <span className="text-sm font-semibold text-emerald-600">EMAIL ADDRESS</span>
              </div>
              <p className="pt-4 text-gray-600 flex items-center gap-2">
                <i className="fa-solid fa-circle-user"></i>
                {profileData.email}
              </p>
            </div>

            {/* Address Section */}
            <div className="group relative">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-sm font-semibold text-emerald-600">SHIPPING ADDRESS</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingAddress(true);
                  }}
                  className="p-2 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <i className="fas fa-pen"></i>
                </button>
              </div>

              {isEditingAddress ? (
                <div className="pt-4 flex gap-4">
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="flex-1 px-4 py-3 border-b-2 border-emerald-500 focus:outline-none text-gray-700 bg-gray-50 rounded-lg"
                    placeholder="Enter your address"
                  />
                  <button
                    onClick={handleAddressSave}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelAddressEdit}
                    className="px-6 py-3 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="pt-4 text-gray-600">{profileData.address || 'No address provided'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
