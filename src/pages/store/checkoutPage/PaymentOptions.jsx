import React from 'react';
import { CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline';

const PaymentOptions = ({ selectedOption, onSelectOption }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
      <div className="space-y-3">
        <div
          className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
            selectedOption === 'COD'
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-gray-200 hover:border-emerald-200'
          }`}
          onClick={() => onSelectOption('COD')}
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
          className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
            selectedOption === 'Razorpay'
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-gray-200 hover:border-emerald-200'
          }`}
          onClick={() => onSelectOption('Razorpay')}
        >
          <div className="flex items-center space-x-4">
            <CreditCardIcon className="h-6 w-6 text-emerald-600" />
            <div>
              <h3 className="font-medium text-gray-900">Credit/Debit Card & UPI</h3>
              <p className="text-sm text-gray-500">Secure online payment via Razorpay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;