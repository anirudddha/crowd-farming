import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  TruckIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  LockClosedIcon,
  CreditCardIcon,
  BanknotesIcon,
  PencilSquareIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';

const defaultAddressForm = {
  street: '',
  city: '',
  state: '',
  zipcode: '',
  country: '',
  phone: '',
  landmark: ''
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  // --- Cart Items State & Fetching ---
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem('token');
  const cartEndpoint = "http://localhost:5000/api/cart";

  const fetchCartItems = useCallback(async () => {
    try {
      const response = await axios.get(cartEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Transform the fetched data to match our UI
      const transformedItems = response.data.data.map(item => ({
        id: item._id,
        title: item.name,
        size: item.size,
        description: `${item.farmName} - ${item.category}`,
        price: item.price,
        quantity: item.quantity,
        image: item.images[0],
        origin: item.origin || "",
        harvestDate: item.harvestDate || ""
      }));
      setCartItems(transformedItems);
    } catch (error) {
      console.error("Error fetching cart items", error);
    }
  }, [token]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const taxes = parseFloat((total * 0.075).toFixed(2));

  // --- Profile & Address State & Fetching ---
  const [profileData, setProfileData] = useState({ addresses: [] });
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/user-profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(response.data);
      if (response.data.addresses?.length > 0) {
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
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [addressForm, setAddressForm] = useState(defaultAddressForm);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    const requiredFields = ['street', 'city', 'state', 'zipcode', 'country', 'phone'];
    requiredFields.forEach(field => {
      if (!addressForm[field]) errors[field] = 'This field is required';
    });
    if (addressForm.phone && !/^\d{10}$/.test(addressForm.phone)) {
      errors.phone = 'Invalid phone number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddressSave = useCallback(async () => {
    if (!validateForm()) return;
    try {
      const updatedAddresses = [...(profileData.addresses || [])];
      const isNewAddress = editingAddressIndex === -1;
      if (isNewAddress) {
        updatedAddresses.push(addressForm);
      } else {
        updatedAddresses[editingAddressIndex] = addressForm;
      }
      await axios.put(
        'http://localhost:5000/api/editAddress',
        { addresses: updatedAddresses, _id: profileData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileData(prev => ({ ...prev, addresses: updatedAddresses }));
      if (isNewAddress) setSelectedAddressIndex(updatedAddresses.length - 1);
      setIsEditingAddress(false);
      setAddressForm(defaultAddressForm);
      toast.success('Address saved successfully!');
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address.');
    }
  }, [addressForm, editingAddressIndex, profileData, token]);

  const handleAddNewAddress = () => {
    setEditingAddressIndex(-1);
    setAddressForm(defaultAddressForm);
    setIsEditingAddress(true);
  };

  const handleEditExistingAddress = (index) => {
    setEditingAddressIndex(index);
    setAddressForm(profileData.addresses[index]);
    setIsEditingAddress(true);
  };

  // --- Payment Options State ---
  const [paymentOption, setPaymentOption] = useState('COD');

  // --- Order Posting State & Handler ---
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleConfirmOrder = async () => {
    // Validate that we have cart items and a shipping address selected
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (selectedAddressIndex === null) {
      toast.error("Please select a shipping address.");
      return;
    }
    // Build the order object
    const order = {
      items: cartItems.map(item => ({
        itemId: item.id,
        quantity: item.quantity,
        price: item.price,
        // weight can be provided if available; here we assume a placeholder value
        weight: 1
      })),
      totalPrice: total + shipping + taxes,
      shippingAddress: profileData.addresses[selectedAddressIndex],
      paymentMethod: paymentOption,
      // Payment status remains "Pending" until processed
      paymentStatus: "Pending"
    };

    try {
      setIsPlacingOrder(true);
      const response = await axios.post(
        'http://localhost:5000/api/orders',
        { order },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order placed successfully!");
      console.log(response.data);
      // Remove all items from the cart backend using the DELETE endpoint for each item
      await Promise.all(
        cartItems.map(item =>
          axios.delete(cartEndpoint, {
            headers: { Authorization: `Bearer ${token}` },
            data: { itemId: item.id }
          })
        )
      );
      // Clear the cart state
      setCartItems([]);
      // Redirect to the orders page
      navigate('/shop/orders');
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <ShoppingCartIcon className="h-8 w-8 text-emerald-600" />
            <span>Checkout</span>
          </h1>
          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="h-2 w-2 bg-emerald-500 rounded-full mr-2"></span>
              <span>Cart Review</span>
            </div>
            <div className="flex items-center">
              <span className="h-2 w-2 bg-emerald-500 rounded-full mr-2"></span>
              <span>Shipping & Payment</span>
            </div>
            <div className="flex items-center">
              <span className="h-2 w-2 bg-gray-300 rounded-full mr-2"></span>
              <span className="text-gray-400">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
              {cartItems.length > 0 ? (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.id}_${item.size}`}
                      className="group flex items-start p-4 border border-gray-100 rounded-xl hover:border-emerald-100 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg shadow-sm"
                      />
                      <div className="ml-4 flex-1 grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                          <div className="mt-2 flex items-center space-x-3 text-sm text-gray-500">
                            <span className="bg-gray-50 px-2 py-1 rounded-md">Qty: {item.quantity}</span>
                            <span className="bg-gray-50 px-2 py-1 rounded-md">Size: {item.size}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-medium text-emerald-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">Loading order items...</p>
              )}
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <TruckIcon className="h-6 w-6 text-emerald-600" />
                  <span>Delivery Information</span>
                </h2>
                <button
                  onClick={handleAddNewAddress}
                  className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  <span>New Address</span>
                </button>
              </div>

              {profileData.addresses?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.addresses.map((addr, index) => (
                    <div
                      key={index}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all 
                        ${selectedAddressIndex === index
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-200'}`}
                      onClick={() => setSelectedAddressIndex(index)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {addr.street}, {addr.city}, {addr.state} {addr.zipcode}
                          </p>
                          <p className="text-gray-500 text-sm mt-1">{addr.country}</p>
                          <p className="text-gray-500 text-sm mt-1">Phone: {addr.phone}</p>
                          {addr.landmark && (
                            <p className="text-sm text-gray-400 mt-1">Landmark: {addr.landmark}</p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditExistingAddress(index);
                          }}
                          className="text-gray-400 hover:text-emerald-600 p-1 rounded-lg"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No saved addresses found</p>
                </div>
              )}
            </div>

            {/* Payment Options */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
              <div className="space-y-3">
                <div
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-colors
                    ${paymentOption === 'COD'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-200'}`}
                  onClick={() => setPaymentOption('COD')}
                >
                  <div className="flex items-center space-x-4">
                    <BanknotesIcon className="h-6 w-6 text-emerald-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Cash on Delivery</h3>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-colors
                    ${paymentOption === 'Razorpay'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-200'}`}
                  onClick={() => setPaymentOption('Razorpay')}
                >
                  <div className="flex items-center space-x-4">
                    <CreditCardIcon className="h-6 w-6 text-emerald-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Credit/Debit Card</h3>
                      <p className="text-sm text-gray-500">Secure online payment via Razorpay</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column – Order Summary */}
          <div className="mt-8 lg:mt-0 lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-25">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span className="text-gray-900">${taxes.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-semibold text-emerald-600">
                    ${(total + shipping + taxes).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={isPlacingOrder}
                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isPlacingOrder ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                ) : (
                  <ShieldCheckIcon className="h-5 w-5" />
                )}
                <span>{isPlacingOrder ? 'Placing Order...' : 'Confirm Order'}</span>
              </button>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 inline-flex items-center space-x-1">
                  <LockClosedIcon className="h-4 w-4" />
                  <span>Secure SSL Encryption</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      {isEditingAddress && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingAddressIndex === -1 ? 'Add New Address' : 'Edit Address'}
              </h3>
              <button
                onClick={() => setIsEditingAddress(false)}
                className="text-gray-400 hover:text-gray-500 rounded-lg"
              >
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                  {formErrors.street && (
                    <span className="ml-2 text-xs text-red-500">{formErrors.street}</span>
                  )}
                </label>
                <input
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${formErrors.street ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                    {formErrors.city && (
                      <span className="ml-2 text-xs text-red-500">{formErrors.city}</span>
                    )}
                  </label>
                  <input
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.city ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                    {formErrors.state && (
                      <span className="ml-2 text-xs text-red-500">{formErrors.state}</span>
                    )}
                  </label>
                  <input
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.state ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                    {formErrors.zipcode && (
                      <span className="ml-2 text-xs text-red-500">{formErrors.zipcode}</span>
                    )}
                  </label>
                  <input
                    value={addressForm.zipcode}
                    onChange={(e) => setAddressForm({ ...addressForm, zipcode: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.zipcode ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                    {formErrors.country && (
                      <span className="ml-2 text-xs text-red-500">{formErrors.country}</span>
                    )}
                  </label>
                  <input
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${formErrors.country ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                  {formErrors.phone && (
                    <span className="ml-2 text-xs text-red-500">{formErrors.phone}</span>
                  )}
                </label>
                <input
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${formErrors.phone ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500`}
                  placeholder="10-digit number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark (optional)
                </label>
                <input
                  value={addressForm.landmark}
                  onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nearby notable location"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsEditingAddress(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddressSave}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
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

export default CheckoutPage;
