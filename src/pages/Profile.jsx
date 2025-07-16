import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import '../styles/Profile.css'; // Assuming this contains animations like 'animate-slide-up'
import { useSelector } from 'react-redux';

// Corrected default address form to include the 'name' field
const defaultAddressForm = {
  name: '',
  street: '',
  city: '',
  state: '',
  zipcode: '',
  country: '',
  phone: '',
  landmark: ''
};

const Profile = () => {

  const endpoint = useSelector(state => state.endpoint.endpoint);

  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    _id: '',
    name: '',
    email: '',
    phone: '',
    profilePicture: {}, // Initial state as an object
    addresses: [],
  });
  const [preview, setPreview] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const [imageFile, setImageFile] = useState(null);

  // Address editing state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [addressForm, setAddressForm] = useState(defaultAddressForm);

  // Delete confirmation modal state
  const [confirmDelete, setConfirmDelete] = useState({ show: false, index: null });

  const token = localStorage.getItem('token');
  const cacheKey = `profileData_${token}`;

  // Fetch profile data with caching
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    const cachedProfile = localStorage.getItem(cacheKey);
    if (cachedProfile) {
      const parsedData = JSON.parse(cachedProfile);
      // Pre-fill fields from cache for a better user experience
      setProfileData(parsedData);
      setPreview(parsedData.profilePicture?.url || ''); // Use optional chaining for safety
      setNewName(parsedData.name);
      setNewPhone(parsedData.phone || '');
    }
    try {
      const response = await axios.get(`${endpoint}/user-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      setProfileData(data);
      // --- FIX: Access the .url property from the profilePicture object ---
      setPreview(data.profilePicture?.url || '');
      setNewName(data.name);
      setNewPhone(data.phone || '');
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching profile:', error);
      // If fetch fails, we continue showing cached data if available
    } finally {
      setIsLoading(false);
    }
  }, [cacheKey, token, endpoint]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const handleUpload = useCallback(async () => {
    if (!imageFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('profilePicture', imageFile);

    try {
      const response = await axios.put(`${endpoint}/profile-picture`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const newPicture = response.data.profilePicture;
      setProfileData(prev => {
        const updatedProfile = { ...prev, profilePicture: newPicture };
        localStorage.setItem(cacheKey, JSON.stringify(updatedProfile));
        return updatedProfile;
      });
      setPreview(newPicture.url);
      setImageFile(null); // Reset file input state
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      // Consider adding user feedback here, e.g., using an alert
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, token, endpoint, cacheKey]);

  const handleNameSave = useCallback(async () => {
    setIsLoading(true);
    try {
      await axios.put(`${endpoint}/editName`, { name: newName, _id: profileData._id });
      setProfileData(prev => {
        const updatedProfile = { ...prev, name: newName };
        localStorage.setItem(cacheKey, JSON.stringify(updatedProfile));
        return updatedProfile;
      });
      setIsEditingName(false);
    } catch (error) {
      console.error('Error saving name:', error);
    } finally {
      setIsLoading(false);
    }
  }, [newName, profileData._id, endpoint, cacheKey]);

  const handlePhoneSave = useCallback(async () => {
    setIsLoading(true);
    try {
      await axios.put(`${endpoint}/editPhone`, { phone: newPhone, _id: profileData._id });
      setProfileData(prev => {
        const updatedProfile = { ...prev, phone: newPhone };
        localStorage.setItem(cacheKey, JSON.stringify(updatedProfile));
        return updatedProfile;
      });
      setIsEditingPhone(false);
    } catch (error) {
      console.error('Error saving phone number:', error);
    } finally {
      setIsLoading(false);
    }
  }, [newPhone, profileData._id, endpoint, cacheKey]);

  const handleAddressSave = useCallback(async () => {
    // FIX: Updated validation to include the 'name' field for the address
    const { name, street, city, state, zipcode, country, phone } = addressForm;
    if (!name || !street || !city || !state || !zipcode || !country || !phone) {
      alert("Please fill in all required fields, including the address name (e.g., 'Home').");
      return;
    }

    setIsLoading(true);
    try {
      let updatedAddresses = [...profileData.addresses];
      if (editingAddressIndex === -1) {
        updatedAddresses.push(addressForm);
      } else {
        updatedAddresses[editingAddressIndex] = addressForm;
      }
      await axios.put(`${endpoint}/editAddress`, { addresses: updatedAddresses, _id: profileData._id });
      setProfileData(prev => {
        const updatedProfile = { ...prev, addresses: updatedAddresses };
        localStorage.setItem(cacheKey, JSON.stringify(updatedProfile));
        return updatedProfile;
      });
      setIsEditingAddress(false);
      setEditingAddressIndex(null);
    } catch (error) {
      console.error('Error saving addresses:', error);
    } finally {
      setIsLoading(false);
    }
  }, [addressForm, editingAddressIndex, profileData, endpoint, cacheKey]);

  const handleCancelAddressEdit = useCallback(() => {
    setIsEditingAddress(false);
    setEditingAddressIndex(null);
    setAddressForm(defaultAddressForm);
  }, []);

  const handleEditExistingAddress = useCallback((index) => {
    setEditingAddressIndex(index);
    setAddressForm(profileData.addresses[index]);
    setIsEditingAddress(true);
  }, [profileData.addresses]);

  const handleAddNewAddress = useCallback(() => {
    if (profileData.addresses && profileData.addresses.length >= 3) {
      alert("You can only have up to 3 addresses.");
      return;
    }
    setEditingAddressIndex(-1);
    setAddressForm(defaultAddressForm);
    setIsEditingAddress(true);
  }, [profileData.addresses]);

  const handleCancelNameEdit = useCallback(() => {
    setNewName(profileData.name);
    setIsEditingName(false);
  }, [profileData.name]);

  const handleCancelPhoneEdit = useCallback(() => {
    setNewPhone(profileData.phone || '');
    setIsEditingPhone(false);
  }, [profileData.phone]);

  const confirmDeleteAddress = useCallback((index) => {
    setConfirmDelete({ show: true, index });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (confirmDelete.index === null) return;

    const addressToDelete = profileData.addresses[confirmDelete.index];
    // The backend expects the ID of the address to be deleted.
    const addressId = addressToDelete._id;

    if (!addressId) {
        console.error("Address ID not found for deletion.");
        return;
    }

    setIsLoading(true);
    try {
        // The API sends back the entire updated user profile, which simplifies state management.
        const response = await axios.delete(`${endpoint}/deleteAddress`, {
            data: { userId: profileData._id, addressId },
            headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(response.data);
        localStorage.setItem(cacheKey, JSON.stringify(response.data));
    } catch (error) {
        console.error("Error deleting address:", error);
    } finally {
        setIsLoading(false);
        setConfirmDelete({ show: false, index: null });
    }
  }, [confirmDelete.index, profileData, token, endpoint, cacheKey]);

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
        <div className="relative bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl shadow-2xl p-8 mb-12 overflow-hidden">
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full" />

          <div className="flex flex-col items-center space-y-6 z-10 relative">
            <label className="relative group cursor-pointer transform hover:scale-105 transition-transform">
              <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg">
                <div className="p-1 bg-white rounded-full">
                  <img
                    className="w-32 h-32 rounded-full object-cover shadow-md"
                    src={preview || 'https://via.placeholder.com/150'} // Fallback image
                    alt="Profile"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/150'; }} // Handle broken image links
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="fa-solid fa-pen text-white text-2xl"></i>
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </label>

            {imageFile && (
              <button onClick={handleUpload} disabled={isLoading} className="px-6 py-2 bg-white text-emerald-600 font-semibold rounded-full shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50">
                {isLoading ? 'Uploading...' : 'Upload New Photo'}
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 transition-all hover:shadow-2xl">
          <div className="space-y-6">
            {/* Name Section */}
            <div className="group relative">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-sm font-semibold text-emerald-600">FULL NAME</span>
                {!isEditingName && <button onClick={() => setIsEditingName(true)} className="p-2 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-gray-50 transition-colors"> <i className="fa-solid fa-pen"></i> </button>}
              </div>
              {isEditingName ? (
                <div className="pt-4 flex gap-4 flex-col sm:flex-row">
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="flex-1 px-4 py-3 border-b-2 border-emerald-500 focus:outline-none text-xl font-semibold bg-gray-50 rounded-lg" placeholder="Enter your name" />
                  <div className="flex gap-2">
                    <button onClick={handleNameSave} className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"> Save </button>
                    <button onClick={handleCancelNameEdit} className="px-4 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition-colors font-semibold"> Cancel </button>
                  </div>
                </div>
              ) : ( <h2 className="pt-4 text-2xl font-bold text-gray-800">{profileData.name}</h2> )}
            </div>

            {/* Email Section */}
            <div className="group">
              <div className="pb-2 border-b border-gray-100"> <span className="text-sm font-semibold text-emerald-600">EMAIL ADDRESS</span> </div>
              <p className="pt-4 text-gray-600 flex items-center gap-2"> <i className="fa-solid fa-envelope text-gray-400"></i> {profileData.email} </p>
            </div>

            {/* Phone Number Section */}
            <div className="group">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-sm font-semibold text-emerald-600">PHONE NUMBER</span>
                {!isEditingPhone && <button onClick={() => setIsEditingPhone(true)} className="p-2 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-gray-50 transition-colors"> <i className="fa-solid fa-pen"></i> </button>}
              </div>
              {isEditingPhone ? (
                <div className="pt-4 flex gap-4 flex-col sm:flex-row">
                  <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="flex-1 px-4 py-3 border-b-2 border-emerald-500 focus:outline-none text-xl font-semibold bg-gray-50 rounded-lg" placeholder="Enter your phone number" />
                  <div className="flex gap-2">
                    <button onClick={handlePhoneSave} className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold"> Save </button>
                    <button onClick={handleCancelPhoneEdit} className="px-4 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition-colors font-semibold"> Cancel </button>
                  </div>
                </div>
              ) : ( <p className="pt-4 text-gray-600 flex items-center gap-2"><i className="fa-solid fa-phone text-gray-400"></i> {profileData.phone || 'No phone number provided'}</p> )}
            </div>

            {/* Addresses Section */}
            <div className="group relative">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-sm font-semibold text-emerald-600">SHIPPING ADDRESSES</span>
                <button onClick={handleAddNewAddress} className="p-2 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-gray-50 transition-colors"> <i className="fa-solid fa-plus"></i> </button>
              </div>
              {profileData.addresses && profileData.addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {profileData.addresses.map((addr, index) => (
                    <div key={addr._id || index} className="relative p-4 bg-gray-50 rounded-lg border hover:border-emerald-200 transition-colors group">
                      <div className="text-sm text-gray-700 space-y-1">
                        {/* FIX: Display address name */}
                        <p className="font-bold text-base text-gray-900">{addr.name}</p>
                        <p className="font-medium">{addr.street}</p>
                        <p>{addr.city}, {addr.state} {addr.zipcode}</p>
                        <p>{addr.country}</p>
                        <p className="text-emerald-600 pt-1">📱 {addr.phone}</p>
                        {addr.landmark && <p className="text-sm text-gray-500">Landmark: {addr.landmark}</p>}
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button onClick={() => handleEditExistingAddress(index)} className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-md hover:bg-gray-100 transition-colors"> <i className="fa-solid fa-pen fa-xs"></i> </button>
                        <button onClick={() => confirmDeleteAddress(index)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100 transition-colors"> <i className="fa-solid fa-trash fa-xs"></i> </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pt-4 text-center py-8">
                  <div className="text-gray-400 mb-2"><i className="fa-solid fa-map-marker-alt fa-2x"></i></div>
                  <p className="text-gray-500">No saved addresses found</p>
                </div>
              )}

              {/* Address Form Modal */}
              {isEditingAddress && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl p-6 w-full sm:max-w-md max-h-screen overflow-y-auto animate-slide-up">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><i className="fa-solid fa-map-location-dot text-emerald-600"></i> {editingAddressIndex === -1 ? 'Add New Address' : 'Edit Address'}</h3>
                    <div className="space-y-4">
                      {/* FIX: Added Input for Address Name */}
                      <div>
                          <label className="text-sm font-medium text-gray-700">Address Name (e.g., Home, Work)</label>
                          <input value={addressForm.name} onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })} className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="My Home" />
                      </div>
                      <div>
                          <label className="text-sm font-medium text-gray-700">Street Address</label>
                          <input value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="123 Main St" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-sm font-medium text-gray-700">City</label>
                              <input value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="New York" />
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-700">State</label>
                              <input value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="NY" />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                              <input value={addressForm.zipcode} onChange={(e) => setAddressForm({ ...addressForm, zipcode: e.target.value })} className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="10001" />
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-700">Country</label>
                              <input value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="United States" />
                          </div>
                      </div>
                      <div>
                          <label className="text-sm font-medium text-gray-700">Phone Number</label>
                          <input value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="+1 234 567 890" />
                      </div>
                      <div>
                          <label className="text-sm font-medium text-gray-700">Landmark (optional)</label>
                          <input value={addressForm.landmark} onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })} className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Near Central Park" />
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                          <button onClick={handleCancelAddressEdit} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"> Cancel </button>
                          <button onClick={handleAddressSave} className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"> Save Address </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDelete.show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full sm:max-w-sm animate-slide-up">
            <h3 className="text-lg font-semibold mb-4">Delete Address</h3>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this address?</p>
            <div className="flex justify-end gap-4">
              <button onClick={handleCancelDelete} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium"> No, Cancel </button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"> Yes, Delete </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;