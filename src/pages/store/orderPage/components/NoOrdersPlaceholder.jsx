// src/pages/OrdersPage/components/NoOrdersPlaceholder.js
import React from 'react';
import { FiInbox } from 'react-icons/fi';

const NoOrdersPlaceholder = () => {
  return (
    <div className="text-center bg-white rounded-xl shadow-sm py-20 px-6">
      <FiInbox className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">No Orders Found</h3>
      <p className="mt-1 text-sm text-gray-500">
        When you place an order, it will appear here.
      </p>
    </div>
  );
};

export default NoOrdersPlaceholder;