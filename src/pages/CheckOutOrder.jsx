import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  TruckIcon, 
  ShieldCheckIcon, 
  ShoppingCartIcon, 
  LockClosedIcon 
} from '@heroicons/react/24/outline';

const defaultAddressForm = {
  street: '',
  city: '',
  state: '',
  zipcode: '',
  country: '',
  phone: '',
  landmark: ''
};

const CheckOutOrder = () => {
  // --- Cart Items & Calculation ---
  const cartItems = [
    {
      id: 1,
      name: 'Organic Heirloom Tomatoes',
      image: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2',
      desc: 'Fresh-picked chemical-free tomatoes',
      price: 4.99,
      quantity: 2,
      unit: 'per lb'
    },
    {
      id: 2,
      name: 'Farm Fresh Eggs',
      image: 'https://images.unsplash.com/photo-1582722872447-31389dc4a4a6',
      desc: 'Free-range chicken eggs',
      price: 6.99,
      quantity: 1,
      unit: 'dozen'
    }
  ];

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const taxes = (total * 0.075).toFixed(2);

  // --- Profile & Addresses State ---
  const [profileData, setProfileData] = useState({ addresses: [] });
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const token = localStorage.getItem('token');

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user-profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(response.data);
      if (response.data.addresses && response.data.addresses.length > 0) {
        setSelectedAddressIndex(0);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // --- Address Modal & Form State ---
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  // editingAddressIndex: -1 means adding a new address; otherwise editing an existing one.
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [addressForm, setAddressForm] = useState(defaultAddressForm);

  const handleAddressSave = useCallback(async () => {
    const { street, city, state, zipcode, country, phone } = addressForm;
    if (!street || !city || !state || !zipcode || !country || !phone) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      // Clone current addresses array (or an empty array if none)
      let updatedAddresses = [...(profileData.addresses || [])];
      if (editingAddressIndex === -1) {
        // Add new address
        updatedAddresses.push(addressForm);
      } else {
        // Update existing address at given index
        updatedAddresses[editingAddressIndex] = addressForm;
      }
      // Call the API to update addresses (works for both add and edit)
      await axios.put('http://localhost:5000/api/editAddress', { 
        addresses: updatedAddresses, 
        _id: profileData._id 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update the local profile data and select the new/updated address
      setProfileData(prev => ({ ...prev, addresses: updatedAddresses }));
      if(editingAddressIndex === -1) {
        setSelectedAddressIndex(updatedAddresses.length - 1);
      }
      setIsEditingAddress(false);
      setEditingAddressIndex(null);
      setAddressForm(defaultAddressForm);
    } catch (error) {
      console.error('Error saving address:', error);
    }
  }, [addressForm, editingAddressIndex, profileData, token]);

  const handleEditExistingAddress = (index) => {
    setEditingAddressIndex(index);
    setAddressForm(profileData.addresses[index]);
    setIsEditingAddress(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddressIndex(-1);
    setAddressForm(defaultAddressForm);
    setIsEditingAddress(true);
  };

  // --- Payment Options State ---
  const [paymentOption, setPaymentOption] = useState('COD');

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-emerald-800 mb-8 flex items-center">
          <ShoppingCartIcon className="h-8 w-8 mr-3" />
          Checkout
        </h1>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* --- Cart Items --- */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Order</h2>
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center py-4 border-b border-gray-100 last:border-0">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="ml-6 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center">
                        <button className="text-emerald-600 hover:text-emerald-700 px-3 py-1 border rounded-lg">-</button>
                        <span className="mx-4 text-gray-700">{item.quantity}</span>
                        <button className="text-emerald-600 hover:text-emerald-700 px-3 py-1 border rounded-lg">+</button>
                      </div>
                      <p className="text-gray-700">
                        ${(item.price * item.quantity).toFixed(2)} {item.unit && ` / ${item.unit}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* --- Delivery Information --- */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <TruckIcon className="h-6 w-6 mr-2 text-emerald-600" />
                Delivery Information
              </h2>
              {profileData.addresses && profileData.addresses.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Select a saved address</h3>
                  <div className="space-y-4">
                    {profileData.addresses.map((addr, index) => (
                      <label key={index} className="flex items-start p-4 border rounded-lg hover:border-emerald-400 transition-colors">
                        <input 
                          type="radio" 
                          name="selectedAddress" 
                          className="mt-1 mr-3" 
                          checked={selectedAddressIndex === index}
                          onChange={() => setSelectedAddressIndex(index)}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {addr.street}, {addr.city}, {addr.state} {addr.zipcode}
                          </p>
                          <p className="text-gray-600">{addr.country}</p>
                          <p className="text-gray-600">Phone: {addr.phone}</p>
                          {addr.landmark && <p className="text-sm text-gray-500">Landmark: {addr.landmark}</p>}
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleEditExistingAddress(index)}
                          className="ml-4 text-emerald-600 hover:text-emerald-800"
                        >
                          Edit
                        </button>
                      </label>
                    ))}
                  </div>
                  <button 
                    type="button"
                    onClick={handleAddNewAddress}
                    className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Add New Address
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">No saved addresses found. Please add one.</p>
                  <button 
                    type="button"
                    onClick={handleAddNewAddress}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Add Address
                  </button>
                </div>
              )}
            </div>

            {/* --- Payment Options --- */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Payment Options
              </h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-emerald-400 transition-colors">
                  <input 
                    type="radio" 
                    name="paymentOption" 
                    value="COD" 
                    checked={paymentOption === 'COD'}
                    onChange={() => setPaymentOption('COD')}
                    className="mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">Cash on Delivery</p>
                    <p className="text-gray-600 text-sm">Pay when your order is delivered.</p>
                  </div>
                </label>
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-emerald-400 transition-colors">
                  <input 
                    type="radio" 
                    name="paymentOption" 
                    value="Razorpay" 
                    checked={paymentOption === 'Razorpay'}
                    onChange={() => setPaymentOption('Razorpay')}
                    className="mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">Razorpay</p>
                    <p className="text-gray-600 text-sm">Proceed to Razorpay for secure online payment.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* --- Right Column: Order Summary & Confirm Order --- */}
          <div className="mt-8 lg:mt-0 lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-800">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span className="text-gray-800">${taxes}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="font-semibold text-lg text-gray-800">Total</span>
                  <span className="font-semibold text-lg text-emerald-600">
                    ${(total + shipping + parseFloat(taxes)).toFixed(2)}
                  </span>
                </div>
              </div>
              <button className="w-full mt-8 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                Confirm Order
              </button>
              {/* <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                <div className="flex">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border rounded-l-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="Enter promo code"
                  />
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-r-lg hover:bg-emerald-700 transition-colors">
                    Apply
                  </button>
                </div>
              </div> */}
              <p className="text-center text-sm text-gray-500 mt-4">
                <LockClosedIcon className="h-4 w-4 inline-block mr-1" />
                Your transaction is secured with 256-bit SSL encryption
              </p>
            </div>
            {/* <div className="mt-6 grid grid-cols-4 gap-4">
              <img src="/visa.svg" alt="Visa" className="h-12 opacity-75" />
              <img src="/mastercard.svg" alt="Mastercard" className="h-12 opacity-75" />
              <img src="/amex.svg" alt="Amex" className="h-12 opacity-75" />
              <img src="/apple-pay.svg" alt="Apple Pay" className="h-12 opacity-75" />
            </div> */}
          </div>
        </div>
      </div>

      {/* --- Address Modal for Adding/Editing --- */}
      {isEditingAddress && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full sm:max-w-md max-h-screen overflow-y-auto">
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
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
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
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">State</label>
                    <input
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="State"
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
                      placeholder="ZIP Code"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Country</label>
                    <input
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="Country"
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
                  onClick={() => {
                    setIsEditingAddress(false);
                    setEditingAddressIndex(null);
                    setAddressForm(defaultAddressForm);
                  }}
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
  );
};

export default CheckOutOrder;
