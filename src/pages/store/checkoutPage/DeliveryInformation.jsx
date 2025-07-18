import React from 'react';
import { TruckIcon, PlusCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'; // <-- Import TrashIcon

const DeliveryInformation = ({
  addresses,
  selectedAddressIndex,
  onSelectAddress,
  onAddNewAddress,
  onEditAddress,
  onDeleteAddress // <-- Add new prop for delete handler
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
          <TruckIcon className="h-6 w-6 text-emerald-600" />
          <span>Delivery Information</span>
        </h2>
        <button
          onClick={onAddNewAddress}
          className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <PlusCircleIcon className="h-5 w-5" />
          <span className="text-sm font-medium">New Address</span>
        </button>
      </div>

      {addresses?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr, index) => (
            <div
              key={index}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex flex-col justify-between ${
                selectedAddressIndex === index
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-emerald-200'
              }`}
              onClick={() => onSelectAddress(index)}
            >
              {/* Address Details */}
              <div>
                <p className="font-medium text-gray-900">{addr.name}</p>
                <p className="text-gray-600 text-sm mt-1">
                  {addr.street}, {addr.city}, {addr.state} {addr.zipcode}
                </p>
                <p className="text-gray-500 text-sm mt-1">{addr.country}</p>
                <p className="text-gray-500 text-sm mt-1">Phone: {addr.phone}</p>
                {addr.landmark && (
                  <p className="text-sm text-gray-400 mt-1">Landmark: {addr.landmark}</p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end items-center space-x-2 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the card from being selected
                    onEditAddress(index);
                  }}
                  className="text-gray-400 hover:text-emerald-600 p-1 rounded-lg transition-colors"
                  aria-label="Edit address"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the card from being selected
                    onDeleteAddress(index);
                  }}
                  className="text-gray-400 hover:text-red-600 p-1 rounded-lg transition-colors"
                  aria-label="Delete address"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No saved addresses found. Please add one.</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryInformation;