import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import '../styles/Profile.css';

const defaultAddressForm = {
  street: '',
  city: '',
  state: '',
  zipcode: '',
  country: '',
  phone: '',
  landmark: ''
};

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    _id: '',
    name: '',
    email: '',
    profilePicture: '',
    addresses: [],
  });
  const [preview, setPreview] = useState('');
  const [base64Image, setBase64Image] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  // For addresses, we manage a separate form state and editing index.
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null); // null: not editing; -1: adding new
  const [addressForm, setAddressForm] = useState(defaultAddressForm);
  const [newName, setNewName] = useState('');
  
  // New state for the delete confirmation modal
  const [confirmDelete, setConfirmDelete] = useState({ show: false, index: null });

  const token = localStorage.getItem('token');
  const cacheKey = `profileData_${token}`;

  // Fetch profile data with caching
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    // Try to load cached data first
    const cachedProfile = localStorage.getItem(cacheKey);
    if (cachedProfile) {
      const parsedData = JSON.parse(cachedProfile);
      setProfileData(parsedData);
      setPreview(parsedData.profilePicture);
      setNewName(parsedData.name);
      setIsLoading(false);
    }
    try {
      const response = await axios.get('http://localhost:5000/api/user-profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(response.data);
      setPreview(response.data.profilePicture);
      setNewName(response.data.name);
      // Update cache with fresh data
      localStorage.setItem(cacheKey, JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, [cacheKey, token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setProfileData(prev => ({ ...prev, profilePicture: response.data.profilePicture }));
      setPreview(response.data.profilePicture);
      // Update cache with new profile picture
      const updatedProfile = { ...profileData, profilePicture: response.data.profilePicture };
      localStorage.setItem(cacheKey, JSON.stringify(updatedProfile));
      setBase64Image('');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setIsLoading(false);
    }
  }, [base64Image, token, profileData, cacheKey]);

  const handleNameSave = useCallback(async () => {
    setIsLoading(true);
    try {
      await axios.put('http://localhost:5000/api/editName', { name: newName, _id: profileData._id });
      setProfileData(prev => ({ ...prev, name: newName }));
      setIsEditingName(false);
      // Update cache with new name
      const updatedProfile = { ...profileData, name: newName };
      localStorage.setItem(cacheKey, JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error saving name:', error);
    } finally {
      setIsLoading(false);
    }
  }, [newName, profileData, cacheKey]);

  // Save address form data – either update an existing address or add a new one.
  const handleAddressSave = useCallback(async () => {
    setIsLoading(true);
    try {
      let updatedAddresses = [...profileData.addresses];
      if (editingAddressIndex === -1) {
        // Add new address
        updatedAddresses.push(addressForm);
      } else {
        // Update existing address at index
        updatedAddresses[editingAddressIndex] = addressForm;
      }
      await axios.put('http://localhost:5000/api/editAddress', { addresses: updatedAddresses, _id: profileData._id });
      setProfileData(prev => ({ ...prev, addresses: updatedAddresses }));
      setIsEditingAddress(false);
      setEditingAddressIndex(null);
      // Update cache with new addresses
      const updatedProfile = { ...profileData, addresses: updatedAddresses };
      localStorage.setItem(cacheKey, JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error saving addresses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [addressForm, editingAddressIndex, profileData, cacheKey]);

  const handleCancelAddressEdit = useCallback(() => {
    setEditingAddressIndex(null);
    setIsEditingAddress(false);
    setAddressForm(defaultAddressForm);
  }, []);

  const handleEditExistingAddress = useCallback((index) => {
    setEditingAddressIndex(index);
    setAddressForm(profileData.addresses[index]);
    setIsEditingAddress(true);
  }, [profileData.addresses]);

  const handleAddNewAddress = useCallback(() => {
    setEditingAddressIndex(-1); // -1 indicates a new address
    setAddressForm(defaultAddressForm);
    setIsEditingAddress(true);
  }, []);

  const handleCancelNameEdit = useCallback(() => {
    setNewName(profileData.name);
    setIsEditingName(false);
  }, [profileData.name]);

  // When delete is clicked, show the confirmation modal.
  const confirmDeleteAddress = useCallback((index) => {
    setConfirmDelete({ show: true, index });
  }, []);

  // Delete address feature if confirmed.
  const handleConfirmDelete = useCallback(async () => {
    const index = confirmDelete.index;
    const addressId = profileData.addresses[index]._id;
    if (!addressId) return;
    setIsLoading(true);
    try {
      const response = await axios.delete('http://localhost:5000/api/deleteAddress', {
        data: { userId: profileData._id, addressId },
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update profileData with response from delete
      setProfileData(response.data);
      localStorage.setItem(cacheKey, JSON.stringify(response.data));
      setConfirmDelete({ show: false, index: null });
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      setIsLoading(false);
    }
  }, [confirmDelete, profileData, token, cacheKey]);

  const handleCancelDelete = useCallback(() => {
    setConfirmDelete({ show: false, index: null });
  }, []);

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

            {/* Enhanced Addresses Section */}
            <div className="group relative">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-sm font-semibold text-emerald-600">SHIPPING ADDRESSES</span>
                <button
                  onClick={handleAddNewAddress}
                  className="p-2 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>

              {profileData.addresses && profileData.addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {profileData.addresses.map((addr, index) => (
                    <div key={index} className="relative p-4 bg-gray-50 rounded-lg border hover:border-emerald-200 transition-colors group">
                      <div className="text-sm text-gray-700 space-y-1">
                        <p className="font-medium text-gray-900">{addr.street}</p>
                        <p>{addr.city}, {addr.state} {addr.zipcode}</p>
                        <p>{addr.country}</p>
                        <p className="text-emerald-600">📱 {addr.phone}</p>
                        {addr.landmark && <p className="text-sm text-gray-500">Landmark: {addr.landmark}</p>}
                        {/* Show timestamps if available */}
                        {addr.createdAt && (
                          <p className="text-xs text-gray-400">
                            Added on: {new Date(addr.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        )}
                        {addr.updatedAt && (
                          <p className="text-xs text-gray-400">
                            Updated on: {new Date(addr.updatedAt).toLocaleDateString('en-IN')}
                          </p>
                        )}
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={() => handleEditExistingAddress(index)}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <i className="fa-solid fa-pen fa-xs"></i>
                        </button>
                        <button
                          onClick={() => confirmDeleteAddress(index)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <i className="fa-solid fa-trash fa-xs"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pt-4 text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <i className="fa-solid fa-map-marker-alt fa-2x"></i>
                  </div>
                  <p className="text-gray-500">No saved addresses found</p>
                </div>
              )}

              {/* Enhanced Address Form - Responsive Modal */}
              {isEditingAddress && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl p-6 w-full sm:max-w-md max-h-screen overflow-y-auto animate-slide-up">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <i className="fa-solid fa-map-location-dot text-emerald-600"></i>
                      {editingAddressIndex === -1 ? 'Add New Address' : 'Edit Address'}
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Street Address</label>
                          <input
                            value={addressForm.street}
                            onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="123 Main St"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">City</label>
                            <input
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                              placeholder="New York"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">State</label>
                            <input
                              value={addressForm.state}
                              onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                              placeholder="NY"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                            <input
                              value={addressForm.zipcode}
                              onChange={(e) => setAddressForm({ ...addressForm, zipcode: e.target.value })}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                              placeholder="10001"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Country</label>
                            <input
                              value={addressForm.country}
                              onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                              placeholder="United States"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">Phone Number</label>
                          <input
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                            placeholder="+1 234 567 890"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">Landmark (optional)</label>
                          <input
                            value={addressForm.landmark}
                            onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                            placeholder="Near Central Park"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          onClick={handleCancelAddressEdit}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddressSave}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                        >
                          Save Address
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {confirmDelete.show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full animate-slide-up">
            <h3 className="text-lg font-semibold mb-4">Delete Address</h3>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this address?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
              >
                No
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
