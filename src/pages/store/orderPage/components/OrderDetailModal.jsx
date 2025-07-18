// src/pages/OrdersPage/components/OrderDetailModal.js
import React from 'react';
import { FiPackage, FiX, FiLoader } from 'react-icons/fi';
import CustomerDetailsCard from './CustomerDetailsCard';
import PaymentInfoCard from './PaymentInfoCard';
import OrderItemsCard from './OrderItemsCard';
import OrderTimeline from './OrderTimeline';

const OrderDetailModal = ({ order, onClose, isLoading }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-50 rounded-xl shadow-2xl max-w-4xl w-full mx-auto overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b bg-white">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold flex items-center text-gray-800">
              <FiPackage className="mr-3 text-emerald-600" />
              Order #{order._id.slice(-6)}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </p>
          </div>
          <button
            className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors"
            onClick={onClose}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <FiLoader className="w-10 h-10 animate-spin text-emerald-600" />
            <p className="mt-4 text-lg font-medium text-gray-700">Loading Order Details...</p>
            <p className="text-sm text-gray-500">Fetching the latest product information.</p>
          </div>
        ) : (
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <CustomerDetailsCard address={order.shippingAddress} />
                <PaymentInfoCard method={order.paymentMethod} status={order.paymentStatus} />
              </div>
              <div className="space-y-6">
                <OrderItemsCard items={order.items} total={order.totalPrice || order.totalAmount} />
                <OrderTimeline order={order} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailModal;