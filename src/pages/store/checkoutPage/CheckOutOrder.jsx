import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import MobileOrderSummaryFooter from './MobileOrderSummaryFooter';

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

const PICKUP_PINCODE = '415111';

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

  // --- Shipping Rate State ---
  const [shippingCost, setShippingCost] = useState(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState('');
  
  // --- NEW: Payment Method Availability State ---
  const [paymentMethodAvailability, setPaymentMethodAvailability] = useState({
    COD: true,
    Razorpay: true,
  });

  // --- Address Modal State ---
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [addressForm, setAddressForm] = useState(defaultAddressForm);
  const [formErrors, setFormErrors] = useState({});

  // ... (handleDeleteAddress, fetchCartItems, fetchProfile are unchanged) ...

  const handleDeleteAddress = async (indexToDelete) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }
    const currentAddresses = profileData.addresses || [];
    const updatedAddresses = currentAddresses.filter((_, index) => index !== indexToDelete);
    try {
      await axios.put(
        `${endpoint}/editAddress`,
        { addresses: updatedAddresses, _id: profileData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileData(prev => ({ ...prev, addresses: updatedAddresses }));
      toast.success('Address deleted successfully!');
      if (indexToDelete === selectedAddressIndex) {
        setSelectedAddressIndex(updatedAddresses.length > 0 ? 0 : null);
      } else if (indexToDelete < selectedAddressIndex) {
        setSelectedAddressIndex(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address.');
    }
  };

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
        weight: Number(item.weight) || 0, // Ensure weight is a number, default to 0
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

  // --- UPDATED: useEffect to Calculate Shipping and Availability ---
  useEffect(() => {
    const canCalculate = cartItems.length > 0 && selectedAddressIndex !== null && profileData.addresses[selectedAddressIndex];

    // Whenever address changes, reset availability before checking again.
    setPaymentMethodAvailability({ COD: true, Razorpay: true });

    if (!canCalculate) {
      setShippingCost(null);
      setShippingError('');
      return;
    }

    const calculateRates = async () => {
      setIsCalculatingShipping(true);
      setShippingError('');
      setShippingCost(null);

      const totalWeightKg = cartItems.reduce((sum, item) => sum + (item.weight * item.quantity), 0) / 1000;
      const weight = Math.max(totalWeightKg, 0.05);
      const delivery_pincode = profileData.addresses[selectedAddressIndex].zipcode;
      const cod = paymentOption === 'COD' ? 1 : 0;

      try {
        const { data } = await axios.get(`${endpoint}/shiprocket/rates`, {
          params: { pickup_pincode: PICKUP_PINCODE, delivery_pincode, weight, cod }
        });

        const availableCouriers = data?.data?.available_courier_companies;
        
        if (availableCouriers && availableCouriers.length > 0) {
          const cheapestRate = availableCouriers[0];
          setShippingCost(parseFloat(cheapestRate.rate));
          setShippingError('');
        } else {
          // No couriers found, means this specific option is unavailable
          let errorMessage;
          if (paymentOption === 'COD') {
            errorMessage = "COD is not available for this pincode.";
            setPaymentMethodAvailability(prev => ({ ...prev, COD: false }));
          } else {
            errorMessage = "Sorry, we can't deliver to this pincode.";
            // If prepaid fails, all options fail
            setPaymentMethodAvailability({ COD: false, Razorpay: false });
          }
          setShippingError(errorMessage);
          toast.error(errorMessage);
        }
      } catch (error) {
        console.error("Error fetching shipping rates:", error);
        let errorMessage;
        if (paymentOption === 'COD') {
          errorMessage = "COD is not available for this pincode.";
          setPaymentMethodAvailability(prev => ({ ...prev, COD: false }));
        } else {
          errorMessage = "Sorry, we can't deliver to this pincode.";
          setPaymentMethodAvailability({ COD: false, Razorpay: false });
        }
        setShippingError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsCalculatingShipping(false);
      }
    };

    const debounceTimer = setTimeout(() => {
        calculateRates();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [cartItems, selectedAddressIndex, paymentOption, profileData.addresses, endpoint]);

  // ... (Address Form Logic is unchanged) ...
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
  const { subtotal, tax, finalTotal } = useMemo(() => {
    const sub = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxAmount = sub * 0.075;
    const total = sub + taxAmount + (shippingCost || 0);
    return { subtotal: sub, tax: taxAmount, finalTotal: total };
  }, [cartItems, shippingCost]);

  // ... (clearCartAndRedirect, createOrderPayload, handleCashOnDelivery, handleRazorpayPayment are unchanged) ...
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

  const createOrderPayload = () => ({
    items: cartItems.map(item => ({
      itemId: item.id, name: item.title, quantity: item.quantity, price: item.price, weight: item.weight,
    })),
    totalPrice: finalTotal,
    shippingAddress: profileData.addresses[selectedAddressIndex],
  });

  const handleCashOnDelivery = async () => {
    const order = { ...createOrderPayload(), paymentMethod: 'COD', paymentStatus: 'Pending' };
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
    const orderPayload = createOrderPayload();
    try {
      const { data } = await axios.post(`${endpoint}/payments/create-product-order`, { amount: finalTotal }, { headers: { Authorization: `Bearer ${token}` } });
      const { order, prefill } = data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount, currency: order.currency, name: "Your Store Name",
        description: "Product Purchase", order_id: order.id,
        handler: async (response) => {
          try {
            const verificationData = { ...response, orderPayload };
            const { data } = await axios.post(`${endpoint}/payments/verify-product-payment`, verificationData, { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) {
              toast.success("Payment successful! Order placed.");
              await clearCartAndRedirect();
            } else { toast.error("Payment verification failed. Please contact support."); }
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
    // Validation checks
    if (cartItems.length === 0) return toast.error("Your cart is empty.");
    if (selectedAddressIndex === null) return toast.error("Please select a shipping address.");
    // NEW: Check if the selected payment method itself is unavailable
    if (!paymentMethodAvailability[paymentOption]) {
      return toast.error(`${paymentOption} is not available for the selected address.`);
    }
    if (shippingCost === null) {
      if (isCalculatingShipping) return toast.error("Please wait, calculating shipping cost...");
      if (shippingError) return toast.error(`Cannot place order: ${shippingError}`);
      return toast.error("Could not determine shipping cost for the selected address.");
    }

    setIsPlacingOrder(true);
    if (paymentOption === 'COD') await handleCashOnDelivery();
    else if (paymentOption === 'Razorpay') await handleRazorpayPayment();
    else {
      toast.error("Please select a valid payment method.");
      setIsPlacingOrder(false);
    }
  };
  
  // NEW: Memoized value to control the "Place Order" button's disabled state
  const isPlaceOrderDisabled = useMemo(() => {
    return (
      isPlacingOrder ||
      isCalculatingShipping ||
      shippingCost === null ||
      !paymentMethodAvailability[paymentOption] // <-- Key addition
    );
  }, [isPlacingOrder, isCalculatingShipping, shippingCost, paymentMethodAvailability, paymentOption]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <ShoppingCartIcon className="h-8 w-8 text-emerald-600" />
            <span>Checkout</span>
          </h1>
          {/* ... */}
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 space-y-6 pb-24 lg:pb-0">
            <OrderItemsList cartItems={cartItems} />
            <DeliveryInformation
              addresses={profileData.addresses}
              selectedAddressIndex={selectedAddressIndex}
              onSelectAddress={setSelectedAddressIndex}
              onAddNewAddress={handleAddNewAddress}
              onEditAddress={handleEditExistingAddress}
              onDeleteAddress={handleDeleteAddress}
            />
            {/* Pass new props to PaymentOptions */}
            <PaymentOptions
              selectedOption={paymentOption}
              onSelectOption={setPaymentOption}
              availability={paymentMethodAvailability}
              shippingError={shippingError}
            />
          </div>

          <div className="hidden lg:block lg:col-span-1">
            {/* Pass new disabled prop */}
            <OrderSummary
              subtotal={subtotal}
              tax={tax}
              shippingCost={shippingCost}
              isCalculatingShipping={isCalculatingShipping}
              shippingError={shippingError}
              finalTotal={finalTotal}
              isPlaceOrderDisabled={isPlaceOrderDisabled} // Use the memoized value
              onConfirmOrder={handleConfirmOrder}
            />
          </div>
        </div>
      </div>

      {/* Pass new disabled prop */}
      <MobileOrderSummaryFooter
        finalTotal={finalTotal}
        isPlaceOrderDisabled={isPlaceOrderDisabled} // Use the memoized value
        onConfirmOrder={handleConfirmOrder}
      />

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