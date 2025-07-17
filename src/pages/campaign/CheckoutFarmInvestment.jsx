import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { ArrowLeft, Minus, Plus, ShieldCheck, TrendingUp, Info } from 'lucide-react';

// --- Reusable Sub-components for a Cleaner Structure ---

const CheckoutHeader = ({ onBack }) => (
  <div className="flex items-center gap-4 mb-8">
    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
      <ArrowLeft size={24} className="text-gray-700" />
    </button>
    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Secure Investment Checkout</h1>
  </div>
);

const InvestmentCalculator = ({ quantity, minInvestment, onIncrement, onDecrement, maxUnits }) => {
  const totalInvestment = quantity * minInvestment;

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-2">1. Choose Your Investment</h2>
      <p className="text-sm text-gray-500 mb-6">Select the number of investment units. Each unit costs ₹{minInvestment.toLocaleString()}.</p>

      <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={onDecrement} className="p-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50" disabled={quantity <= 1}>
            <Minus size={20} />
          </button>
          <span className="text-3xl font-bold w-16 text-center">{quantity}</span>
          <button onClick={onIncrement} className="p-2 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50" disabled={quantity >= maxUnits}>
            <Plus size={20} />
          </button>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Investment</p>
          <p className="text-3xl md:text-4xl font-extrabold text-emerald-600">
            ₹{totalInvestment.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

const InvestmentChecklist = ({ share, returns }) => (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-6">2. Final Checklist</h2>
      <ul className="space-y-5">
        <li className="flex items-start gap-4">
            <ShieldCheck className="text-emerald-500 flex-shrink-0 mt-1" size={20} />
            <div>
                <h4 className="font-semibold text-gray-800">Your Ownership</h4>
                <p className="text-sm text-gray-500">Your investment will represent an approximate <strong className="text-gray-700">{share}% share</strong> of the farm's funding goal for this campaign.</p>
            </div>
        </li>
        <li className="flex items-start gap-4">
            <TrendingUp className="text-emerald-500 flex-shrink-0 mt-1" size={20} />
            <div>
                <h4 className="font-semibold text-gray-800">Expected Returns</h4>
                <p className="text-sm text-gray-500">The projected return is <strong className="text-gray-700">{returns}</strong>. This is an estimate and not a guarantee.</p>
            </div>
        </li>
        <li className="flex items-start gap-4">
            <Info className="text-emerald-500 flex-shrink-0 mt-1" size={20} />
            <div>
                <h4 className="font-semibold text-gray-800">Acknowledge Risk</h4>
                <p className="text-sm text-gray-500">You understand that agricultural investments carry inherent risks, including market and environmental factors.</p>
            </div>
        </li>
      </ul>
    </div>
);

const OrderSummaryCard = ({ campaign, quantity, total, share, onConfirm, investing }) => (
  <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 space-y-6">
    <h3 className="text-lg font-bold text-gray-800">Order Summary</h3>
    <div className="flex items-start gap-4 pb-6 border-b">
      <img src={campaign.visuals?.[0]?.url || 'https://via.placeholder.com/100'} alt={campaign.campaignTitle} className="w-20 h-20 rounded-lg object-cover" />
      <div>
        <p className="font-bold text-gray-900">{campaign.campaignTitle}</p>
        <p className="text-sm text-gray-500">{campaign.farmName}</p>
      </div>
    </div>
    <div className="space-y-2 text-sm">
        <h4 className="font-semibold text-gray-700 mb-2">Campaign Snapshot</h4>
        <div className="flex justify-between"><span className="text-gray-600">Funding Goal</span><span className="font-medium text-gray-800">₹{campaign.fundingGoal.toLocaleString()}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">Currently Raised</span><span className="font-medium text-gray-800">₹{campaign.raisedAmount.toLocaleString()}</span></div>
        <div className="flex justify-between"><span className="text-gray-600">Days Remaining</span><span className="font-medium text-gray-800">{Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 3600 * 24))}</span></div>
    </div>
    <div className="space-y-2 text-sm pt-4 border-t">
        <h4 className="font-semibold text-gray-700 mb-2">Your Investment</h4>
        <div className="flex justify-between"><span className="text-gray-600">Investment ({quantity} units)</span><span className="font-medium text-gray-800">₹{total.toLocaleString()}</span></div>
        <div className="flex justify-between text-green-600"><span className="text-gray-600">Farm Share</span><span className="font-medium text-green-600">{share}%</span></div>
    </div>
    <div className="pt-4 border-t">
      <div className="flex justify-between items-baseline">
        <span className="text-lg font-bold text-gray-900">Grand Total</span>
        <span className="text-2xl font-extrabold text-gray-900">₹{total.toLocaleString()}</span>
      </div>
    </div>
    <button
      onClick={onConfirm}
      disabled={investing}
      className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
    >
      {investing ? (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="h-6 w-6 mx-auto border-2 border-white border-t-transparent rounded-full" />
      ) : 'Confirm & Finalize Investment'}
    </button>
  </div>
);

// --- Main Checkout Component ---

const CheckoutFarmInvestment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get backend endpoint from Redux store, as you specified.
  const endpoint = useSelector((state) => state.endpoint.endpoint);
  
  const passedCampaign = location.state?.campaign;
  const [campaign, setCampaign] = useState(passedCampaign || null);
  
  const [quantity, setQuantity] = useState(1);
  const [investing, setInvesting] = useState(false);

  useEffect(() => {
    if (!passedCampaign) {
      toast.error("Campaign details not found. Redirecting...", { duration: 2000 });
      setTimeout(() => navigate('/'), 2000);
    } else {
      setQuantity(1);
    }
  }, [passedCampaign, navigate]);

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const minInvestment = parseInt(campaign.minInvestment, 10);
  const fundingGoal = parseInt(campaign.fundingGoal, 10);
  const raisedAmount = parseInt(campaign.raisedAmount, 10);
  const remainingAmount = fundingGoal - raisedAmount;
  const maxUnits = Math.floor(remainingAmount / minInvestment);
  const totalInvestment = quantity * minInvestment;
  const percentageShare = ((totalInvestment / fundingGoal) * 100).toFixed(2);
  const expectedReturnsFormatted = campaign.expectedReturns?.type === 'Fixed Multiple'
    ? `${campaign.expectedReturns.min}x`
    : `${campaign.expectedReturns.min}% - ${campaign.expectedReturns.max}%`;

  const handleIncrement = () => {
    if (quantity < maxUnits) {
      setQuantity(quantity + 1);
    } else {
      toast.error('You have reached the maximum available investment.');
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // --- NEW, SECURE, AND EFFICIENT RAZORPAY PAYMENT LOGIC ---
  const handleConfirmInvestment = async () => {
    if (totalInvestment < minInvestment) {
      toast.error(`Minimum investment of ₹${minInvestment.toLocaleString()} is required`);
      return;
    }
    setInvesting(true);
    
    try {
      // Step 1: Create order & get user details from backend in ONE call.
      const { data } = await axios.post(
        `${endpoint}/payments/create-order`,
        {
          amount: totalInvestment,
          campaignId: campaign._id,
        },
        {
          // Your middleware will use this token to find the user on the backend
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      
      // Destructure the response from our backend
      const { order, prefill } = data;

      // Step 2: Configure and open the Razorpay payment modal
      const options = {
        key: 'rzp_test_tRT25JXIPqrKtZ',
        amount: order.amount,
        currency: order.currency,
        name: "AgriFund",
        description: `Investment for ${campaign.campaignTitle}`,
        order_id: order.id,
        
        // Step 3: This handler is called on successful payment
        handler: async function (response) {
            const verificationData = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                campaignId: campaign._id,
                amount: totalInvestment
            };
            
            try {
                // Step 4: Verify the payment on the backend
                const { data } = await axios.post(
                    `${endpoint}/payments/verify-payment`,
                    verificationData,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );

                if (data.success) {
                    toast.success('Investment Successful! Redirecting...');
                    navigate(`/campaign/${campaign._id}`);
                } else {
                    toast.error('Payment verification failed. Please contact support.');
                }
            } catch (error) {
                console.error('Error verifying payment:', error);
                toast.error(error.response?.data?.message || 'Payment verification failed.');
            }
        },
        
        // Use the prefill data we received from our own backend
        prefill: prefill,

        theme: {
          color: '#059669',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function (response) {
        console.error(response);
        toast.error(`Payment Failed: ${response.error.description}`);
      });

    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      toast.error(error.response?.data?.message || 'Could not initiate payment process.');
    } finally {
      setInvesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <CheckoutHeader onBack={() => navigate(-1)} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            <InvestmentCalculator
              quantity={quantity}
              minInvestment={minInvestment}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              maxUnits={maxUnits}
            />
            <InvestmentChecklist
                share={percentageShare}
                returns={expectedReturnsFormatted}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky top-24">
              <OrderSummaryCard
                campaign={campaign}
                quantity={quantity}
                total={totalInvestment}
                share={percentageShare}
                onConfirm={handleConfirmInvestment}
                investing={investing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutFarmInvestment;