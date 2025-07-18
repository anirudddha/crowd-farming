// src/pages/CheckoutPage/components/MobileOrderSummaryFooter.js

import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const MobileOrderSummaryFooter = ({ finalTotal, isPlacingOrder, onConfirmOrder }) => {
  return (
    // This component is fixed to the bottom, has a high z-index,
    // and is hidden on large screens and up (lg:hidden)
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 shadow-lg-top z-40 lg:hidden">
      <div className="flex items-center justify-between gap-4">
        {/* Total Price Display */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Total Price</span>
          <span className="text-xl font-bold text-emerald-600">
            ₹{finalTotal.toFixed(2)}
          </span>
        </div>

        {/* Place Order Button */}
        <button
          onClick={onConfirmOrder}
          disabled={isPlacingOrder}
          className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 disabled:bg-emerald-400 disabled:cursor-not-allowed"
        >
          {isPlacingOrder ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : (
            <ShieldCheckIcon className="h-5 w-5" />
          )}
          <span>{isPlacingOrder ? 'Processing...' : 'Place Order'}</span>
        </button>
      </div>
    </div>
  );
};

export default MobileOrderSummaryFooter;