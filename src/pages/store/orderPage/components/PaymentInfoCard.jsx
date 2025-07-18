import React from 'react';
import { FiCreditCard } from 'react-icons/fi';

const PaymentInfoCard = ({ method, status }) => (
  <div className="bg-sky-50 p-4 rounded-lg border-2 border-sky-200">
    <h3 className="font-semibold mb-3 flex items-center text-sky-800">
      <FiCreditCard className="mr-2" /> Payment Information
    </h3>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Method:</span>
        <span className="font-medium text-gray-900">{method}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Status:</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status === 'Paid'
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800'}`}>
          {status}
        </span>
      </div>
    </div>
  </div>
);

export default PaymentInfoCard;