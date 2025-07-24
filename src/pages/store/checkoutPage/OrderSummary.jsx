import React from 'react';
import { ShieldCheckIcon, LockClosedIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const OrderSummary = ({
  subtotal,
  tax,
  shippingCost,
  isCalculatingShipping,
  shippingError,
  finalTotal,
  isPlaceOrderDisabled, // Changed from isPlacingOrder
  onConfirmOrder
}) => {
  // ... (formatCurrency and renderShipping functions are unchanged) ...
    const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '₹0.00';
    return `₹${amount.toFixed(2)}`;
  };
    const renderShipping = () => {
    if (isCalculatingShipping) {
      return (
        <span className="flex items-center text-sm text-gray-500">
          <ClockIcon className="h-4 w-4 mr-1 animate-spin" />
          Calculating...
        </span>
      );
    }
    if (shippingError) {
      return (
        <span className="flex items-center text-sm text-red-500" title={shippingError}>
          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
          Unavailable
        </span>
      );
    }
    if (shippingCost !== null) {
      return <span className="text-gray-900">{formatCurrency(shippingCost)}</span>;
    }
    return <span className="text-gray-500">-</span>;
  };


  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky md:top-24">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
      {/* ... (summary details are unchanged) ... */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Taxes</span>
          <span className="text-gray-900">{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Shipping</span>
          {renderShipping()}
        </div>
        <div className="border-t border-gray-200 pt-4 flex justify-between">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="font-semibold text-emerald-600 text-lg">
            {formatCurrency(finalTotal)}
          </span>
        </div>
      </div>

      <button
        onClick={onConfirmOrder}
        // Use the new, more comprehensive disabled prop
        disabled={isPlaceOrderDisabled}
        className="hidden lg:flex w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-medium transition-colors items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isPlaceOrderDisabled && isCalculatingShipping ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        ) : (
          <ShieldCheckIcon className="h-5 w-5" />
        )}
        <span>{isPlaceOrderDisabled && isCalculatingShipping ? 'Calculating...' : 'Place Order'}</span>
      </button>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 inline-flex items-center space-x-1">
          <LockClosedIcon className="h-4 w-4" />
          <span>Secure SSL Encryption</span>
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;