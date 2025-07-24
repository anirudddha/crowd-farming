import React from 'react';
import { CreditCardIcon, BanknotesIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const PaymentOptions = ({ selectedOption, onSelectOption, availability, shippingError }) => {
  const isCodAvailable = availability.COD;
  const isRazorpayAvailable = availability.Razorpay;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
      <div className="space-y-4">
        {/* Cash on Delivery Option */}
        <div
          className={`
            p-4 rounded-xl border-2 transition-all
            ${selectedOption === 'COD' && isCodAvailable ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}
            ${isCodAvailable ? 'cursor-pointer hover:border-emerald-200' : 'bg-gray-100 opacity-60 cursor-not-allowed'}
          `}
          onClick={() => isCodAvailable && onSelectOption('COD')}
        >
          <div className="flex items-center space-x-4">
            <BanknotesIcon className={`h-6 w-6 ${isCodAvailable ? 'text-emerald-600' : 'text-gray-400'}`} />
            <div>
              <h3 className={`font-medium ${isCodAvailable ? 'text-gray-900' : 'text-gray-500'}`}>Cash on Delivery</h3>
              <p className="text-sm text-gray-500">Pay when you receive your order</p>
            </div>
          </div>
          {!isCodAvailable && shippingError.includes('COD') && (
            <div className="mt-2 text-xs text-red-600 flex items-center space-x-1 pl-10">
              <ExclamationCircleIcon className="h-4 w-4" />
              <span>{shippingError}</span>
            </div>
          )}
        </div>

        {/* Razorpay Option */}
        <div
          className={`
            p-4 rounded-xl border-2 transition-colors
            ${selectedOption === 'Razorpay' && isRazorpayAvailable ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}
            ${isRazorpayAvailable ? 'cursor-pointer hover:border-emerald-200' : 'bg-gray-100 opacity-60 cursor-not-allowed'}
          `}
          onClick={() => isRazorpayAvailable && onSelectOption('Razorpay')}
        >
          <div className="flex items-center space-x-4">
            <CreditCardIcon className={`h-6 w-6 ${isRazorpayAvailable ? 'text-emerald-600' : 'text-gray-400'}`} />
            <div>
              <h3 className={`font-medium ${isRazorpayAvailable ? 'text-gray-900' : 'text-gray-500'}`}>Credit/Debit Card & UPI</h3>
              <p className="text-sm text-gray-500">Secure online payment via Razorpay</p>
            </div>
          </div>
           {!isRazorpayAvailable && (
            <div className="mt-2 text-xs text-red-600 flex items-center space-x-1 pl-10">
              <ExclamationCircleIcon className="h-4 w-4" />
              <span>Online payment is currently unavailable.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;