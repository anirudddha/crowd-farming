// src/pages/OrdersPage/components/OrdersList.js
import React from 'react';
import { FiPackage, FiChevronRight } from 'react-icons/fi';
import { Calendar } from 'lucide-react';

const statusStyles = {
  Processing: 'bg-yellow-100 text-yellow-800',
  Shipped: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
  Pending: 'bg-gray-100 text-gray-800'
};

const OrdersList = ({ orders, onOrderSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Mobile View: List of Cards (hidden on md and up) */}
      <div className="md:hidden">
        <ul className="divide-y divide-gray-200">
          {orders.map((order) => (
            <li
              key={order._id}
              onClick={() => onOrderSelect(order)}
              className="p-4 active:bg-gray-100"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">
                    Order #{order._id.slice(-6)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-lg">₹{order.totalPrice || order.totalAmount}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${statusStyles[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <FiChevronRight className="ml-2 h-5 w-5 text-gray-400 flex-shrink-0" />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop View: Table (hidden on sm screens) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordered at</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr
                key={order._id}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onOrderSelect(order)}
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{order._id.slice(-6)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  <div className="flex items-center">
                    <Calendar className='mr-2 text-gray-400 h-4 w-4' />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  <div className="flex items-center">
                    <FiPackage className="mr-2 text-gray-400" />
                    {order.items.length} items
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyles[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900">
                  ₹{order.totalPrice || order.totalAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersList;