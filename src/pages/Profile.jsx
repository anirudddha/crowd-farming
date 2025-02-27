import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPen } from 'react-icons/fa';
import Loader from '../components/Loader';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setBase64Image(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
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
      setProfileData({ ...profileData, profilePicture: response.data.profilePicture });
      setBase64Image('');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameSave = async () => {
    setIsLoading(true);
    try {
      await axios.put('http://localhost:5000/api/editName', { name: newName, _id: profileData._id });
      setProfileData({ ...profileData, name: newName });
      setIsEditingName(false);
    } catch (error) {
      console.error('Error saving name:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSave = async () => {
    setIsLoading(true);
    try {
      await axios.put('http://localhost:5000/api/editAddress', { address: newAddress, _id: profileData._id });
      setProfileData({ ...profileData, address: newAddress });
      setIsEditingAddress(false);
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="px-6 py-8 border-b border-gray-200">
          <div className="flex flex-col items-center space-y-4">
            <label className="relative group cursor-pointer">
              <img
                className="w-32 h-32 rounded-full object-cover shadow-lg group-hover:opacity-75 transition-opacity"
                src={preview || '/default-profile.png'}
                alt="Profile"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FaPen className="text-white text-xl" />
              </div>
              <input
                type="file"
                id="file-input"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </label>
            
            {base64Image && (
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Upload New Photo
              </button>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="px-6 py-8 space-y-6">
          {/* Name Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Full Name</label>
            {isEditingName ? (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Enter your name"
                />
                <button
                  onClick={handleNameSave}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between group">
                <span className="text-xl font-semibold text-gray-900">{profileData.name}</span>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-2 text-gray-400 hover:text-emerald-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FaPen className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Email Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Email Address</label>
            <p className="text-gray-700">{profileData.email}</p>
          </div>

          {/* Address Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Shipping Address</label>
            {isEditingAddress ? (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Enter your address"
                />
                <button
                  onClick={handleAddressSave}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between group">
                <p className="text-gray-700">{profileData.address || 'No address provided'}</p>
                <button
                  onClick={() => setIsEditingAddress(true)}
                  className="p-2 text-gray-400 hover:text-emerald-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FaPen className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;