import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';

const OrderItemsCard = ({ items, total }) => (
  <div className="bg-white border-2 rounded-lg border-gray-300 p-4">
    <h3 className="font-semibold mb-4 flex items-center text-gray-800">
      <FiShoppingCart className="mr-2" /> Order Items
    </h3>
    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-4">
          <img
            src={item.image?.url || 'https://via.placeholder.com/150'}
            alt={item.name}
            className="w-16 h-16 rounded-lg object-cover border flex-shrink-0 bg-gray-100"
          />
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{item.name}</h4>
            <p className="text-sm text-gray-600">
              {item.size ? `${item.size} • ` : ''}{item.quantity} units
            </p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-500">₹{item.price}/unit</span>
              <span className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-6 pt-4 border-t-2 border-dashed">
      <div className="flex justify-between font-bold text-lg">
        <span>Total Amount</span>
        <span>₹{total}</span>
      </div>
    </div>
  </div>
);

export default OrderItemsCard;