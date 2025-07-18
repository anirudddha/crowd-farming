import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setNumber } from '../../../redux/globalStates';

// Import child components
import OrderItemsList from './OrderItemsList';
import DeliveryInformation from './DeliveryInformation';
import PaymentOptions from './PaymentOptions';
import OrderSummary from './OrderSummary';
import AddressFormModal from './AddressFormModal';
import MobileOrderSummaryFooter from './MobileOrderSummaryFooter'; // <-- Import new component


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

const CheckoutPage = () => {

  const endpoint = useSelector((state) => state.endpoint.endpoint);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // --- State Management ---
  const [cartItems, setCartItems] = useState([]);
  const [profileData, setProfileData] = useState({ addresses: [] });
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [paymentOption, setPaymentOption] = useState('COD');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // --- Address Modal State ---
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [addressForm, setAddressForm] = useState(defaultAddressForm);
  const [formErrors, setFormErrors] = useState({});


  // --- NEW: Address Deletion Handler ---
  const handleDeleteAddress = async (indexToDelete) => {
    // Confirmation prompt to prevent accidental deletion
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    const currentAddresses = profileData.addresses || [];
    // Create a new array excluding the address to be deleted
    const updatedAddresses = currentAddresses.filter((_, index) => index !== indexToDelete);

    try {
      // Use the same endpoint as editing to update the addresses array
      await axios.put(
        `${endpoint}/editAddress`,
        { addresses: updatedAddresses, _id: profileData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setProfileData(prev => ({ ...prev, addresses: updatedAddresses }));
      toast.success('Address deleted successfully!');

      // Handle the case where the deleted address was the selected one
      if (indexToDelete === selectedAddressIndex) {
        // If there are other addresses left, select the first one. Otherwise, no selection.
        setSelectedAddressIndex(updatedAddresses.length > 0 ? 0 : null);
      } else if (indexToDelete < selectedAddressIndex) {
        // If an address before the selected one was deleted, shift the index down
        setSelectedAddressIndex(prev => prev - 1);
      }

    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address.');
    }
  };


  // --- Data Fetching ---
  const fetchCartItems = useCallback(async () => {
    try {
      const response = await axios.get(`${endpoint}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const transformedItems = response.data.data.items.map(item => ({
        id: item.id,
        title: item.name,
        size: item.size,
        description: `${item.farmName} - ${item.category}`,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        origin: item.origin || "",
        weight: item.weight,
        harvestDate: item.harvestDate || ""
      }));
      setCartItems(transformedItems);
    } catch (error) {
      console.error("Error fetching cart items", error);
      toast.error("Could not load your cart items.");
    }
  }, [token, endpoint]);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await axios.get(`${endpoint}/user-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(response.data);
      if (response.data.addresses?.length > 0) {
        setSelectedAddressIndex(0);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error("Could not load your profile.");
    }
  }, [token, endpoint]);

  useEffect(() => {
    fetchCartItems();
    fetchProfile();
  }, [fetchCartItems, fetchProfile]);

  // --- Address Form Logic ---
  const validateForm = () => {
    const errors = {};
    const requiredFields = ['name', 'street', 'city', 'state', 'zipcode', 'country', 'phone'];
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
        `${endpoint}/editAddress`,
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
  }, [addressForm, editingAddressIndex, profileData, token, endpoint]);

  const handleAddNewAddress = () => {
    setEditingAddressIndex(-1);
    setAddressForm(defaultAddressForm);
    setFormErrors({});
    setIsEditingAddress(true);
  };

  const handleEditExistingAddress = (index) => {
    setEditingAddressIndex(index);
    setAddressForm(profileData.addresses[index]);
    setFormErrors({});
    setIsEditingAddress(true);
  };

  // --- Order Placement Logic ---
  const finalTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 5.99 + (cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 0.075);

  const clearCartAndRedirect = async () => {
    try {
      await axios.delete(`${endpoint}/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems([]);
      dispatch(setNumber(0));
      navigate('/shop/orders');
    } catch (error) {
      console.error("Failed to clear cart after order placement", error);
      toast.error("Order placed, but failed to clear cart. Please do it manually.");
      dispatch(setNumber(0));
      navigate('/shop/orders');
    }
  };

  const handleCashOnDelivery = async () => {
    const order = {
      items: cartItems.map(item => ({
        itemId: item.id, name: item.title, quantity: item.quantity, price: item.price, weight: item.weight,
      })),
      totalPrice: finalTotal,
      shippingAddress: profileData.addresses[selectedAddressIndex],
      paymentMethod: 'COD', paymentStatus: 'Pending'
    };
    try {
      await axios.post(`${endpoint}/orders`, { order }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Order placed successfully with Cash on Delivery!");
      await clearCartAndRedirect();
    } catch (error) {
      console.error("Error placing COD order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleRazorpayPayment = async () => {
    const orderPayload = {
      items: cartItems.map(item => ({
        itemId: item.id, name: item.title, quantity: item.quantity, price: item.price, weight: item.weight,
      })),
      totalPrice: finalTotal,
      shippingAddress: profileData.addresses[selectedAddressIndex],
    };
    try {
      const { data } = await axios.post(`${endpoint}/payments/create-product-order`, { amount: finalTotal }, { headers: { Authorization: `Bearer ${token}` } });
      const { order, prefill } = data;
      const options = {
        key: 'rzp_test_tRT25JXIPqrKtZ',
        amount: order.amount, currency: order.currency, name: "Your Store Name",
        description: "Product Purchase", order_id: order.id,
        handler: async (response) => {
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderPayload: orderPayload,
            };
            const { data } = await axios.post(`${endpoint}/payments/verify-product-payment`, verificationData, { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) {
              toast.success("Payment successful! Order placed.");
              await clearCartAndRedirect();
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch (verifyError) {
            toast.error("Failed to verify payment. Please contact support.");
          }
        },
        prefill: prefill, theme: { color: '#10B981' },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      paymentObject.on('payment.failed', (response) => toast.error(`Payment Failed: ${response.error.description}`));
    } catch (error) {
      console.error("Error initiating Razorpay payment:", error);
      toast.error("Could not start payment process. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) return toast.error("Your cart is empty.");
    if (selectedAddressIndex === null) return toast.error("Please select a shipping address.");

    setIsPlacingOrder(true);
    if (paymentOption === 'COD') await handleCashOnDelivery();
    else if (paymentOption === 'Razorpay') await handleRazorpayPayment();
    else {
      toast.error("Please select a valid payment method.");
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
            <div className="flex items-center"><span className="h-2 w-2 bg-emerald-500 rounded-full mr-2"></span><span>Cart Review</span></div>
            <div className="flex items-center"><span className="h-2 w-2 bg-emerald-500 rounded-full mr-2"></span><span>Shipping & Payment</span></div>
            <div className="flex items-center"><span className="h-2 w-2 bg-gray-300 rounded-full mr-2"></span><span className="text-gray-400">Confirmation</span></div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Column */}
          {/* Add padding-bottom on mobile to make space for the sticky footer */}
          <div className="lg:col-span-2 space-y-6 pb-5 lg:pb-0">
            <OrderItemsList cartItems={cartItems} />
            <DeliveryInformation
              addresses={profileData.addresses}
              selectedAddressIndex={selectedAddressIndex}
              onSelectAddress={setSelectedAddressIndex}
              onAddNewAddress={handleAddNewAddress}
              onEditAddress={handleEditExistingAddress}
              onDeleteAddress={handleDeleteAddress} // <-- Pass the new handler
            />
            <PaymentOptions
              selectedOption={paymentOption}
              onSelectOption={setPaymentOption}
            />
          </div>

          {/* Right Column – Order Summary for DESKTOP */}
          {/* This entire div is hidden on mobile and shown on desktop */}
          <div className=" lg:mt-0 lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              finalTotal={finalTotal}
              isPlacingOrder={isPlacingOrder}
              onConfirmOrder={handleConfirmOrder}
            />
          </div>
        </div>
      </div>

      {/* --- Mobile Sticky Footer --- */}
      {/* This component will automatically hide on desktop via its internal classes */}
      <MobileOrderSummaryFooter
        finalTotal={finalTotal}
        isPlacingOrder={isPlacingOrder}
        onConfirmOrder={handleConfirmOrder}
      />

      {/* Address Form Modal */}
      <AddressFormModal
        isOpen={isEditingAddress}
        onClose={() => setIsEditingAddress(false)}
        formData={addressForm}
        onFormChange={setAddressForm}
        onSave={handleAddressSave}
        errors={formErrors}
        isNew={editingAddressIndex === -1}
      />
    </div>
  );
};

export default CheckoutPage;