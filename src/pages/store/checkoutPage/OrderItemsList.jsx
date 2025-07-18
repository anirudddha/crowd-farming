import React from 'react';

const OrderItemsList = ({ cartItems }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
      {cartItems.length > 0 ? (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.id}_${item.size}`}
              className="group flex items-start p-3 sm:p-4 border border-gray-100 rounded-xl hover:border-emerald-100 transition-colors"
            >
              {/* Image: Slightly smaller on mobile */}
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-lg shadow-sm flex-shrink-0"
              />
              {/* Details Container: Stacks vertically on mobile, becomes a grid on larger screens */}
              <div className="ml-4 flex-1 flex flex-col sm:grid sm:grid-cols-3 sm:gap-4">

                {/* Main Info: Title, Description (desktop-only), Qty/Size */}
                <div className="sm:col-span-2">
                  <h3 className="font-medium text-gray-900 leading-tight">{item.title}</h3>

                  {/* Description: Hidden by default, appears on sm screens and up */}
                  <p className="hidden sm:block text-sm text-gray-500 mt-1">{item.description}</p>

                  <div className="mt-2 flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                    <span className="bg-gray-50 px-2 py-1 rounded-md">Qty: {item.quantity}</span>
                    <span className="bg-gray-50 px-2 py-1 rounded-md">Size: {item.size}</span>
                  </div>
                </div>

                <div
                  className="flex justify-between items-center mt-2 md:block md:mt-0 md:text-right">
                  <p className="text-base md:text-lg font-medium text-emerald-600">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 md:mt-1">
                    ₹{item.price.toFixed(2)} each
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">Loading order items...</p>
      )}
    </div>
  );
};

export default OrderItemsList;