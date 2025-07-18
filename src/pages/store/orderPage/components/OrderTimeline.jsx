import React from 'react';
import { FiCheckCircle, FiPackage } from 'react-icons/fi';

const OrderTimeline = ({ order }) => (
  <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
    <h3 className="font-semibold mb-4 flex items-center text-purple-800">
      <FiCheckCircle className="mr-2" /> Order Timeline
    </h3>
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="mt-1 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <FiCheckCircle className="text-green-600 w-4 h-4" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Order Placed</p>
          <p className="text-sm text-gray-600">
            {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
      </div>
      {/* Add more timeline events here as they become available */}
      <div className="flex items-start gap-3 opacity-70">
        <div className="mt-1 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <FiPackage className="text-blue-600 w-4 h-4" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{order.orderStatus}</p>
          <p className="text-sm text-gray-600">
            Last updated: {new Date(order.updatedAt).toLocaleDateString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default OrderTimeline;