import React from 'react';

const AddressFormModal = ({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSave,
  errors,
  isNew,
}) => {
  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormChange({ ...formData, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {isNew ? 'Add New Address' : 'Edit Address'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 rounded-lg p-1">
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
              {errors.name && <span className="ml-2 text-xs text-red-500">{errors.name}</span>}
            </label>
            <input name="name" value={formData.name} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
              {errors.street && <span className="ml-2 text-xs text-red-500">{errors.street}</span>}
            </label>
            <input name="street" value={formData.street} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg ${errors.street ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
                {errors.city && <span className="ml-2 text-xs text-red-500">{errors.city}</span>}
              </label>
              <input name="city" value={formData.city} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg ${errors.city ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
                {errors.state && <span className="ml-2 text-xs text-red-500">{errors.state}</span>}
              </label>
              <input name="state" value={formData.state} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg ${errors.state ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500`} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code *
                {errors.zipcode && <span className="ml-2 text-xs text-red-500">{errors.zipcode}</span>}
              </label>
              <input name="zipcode" value={formData.zipcode} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg ${errors.zipcode ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
                {errors.country && <span className="ml-2 text-xs text-red-500">{errors.country}</span>}
              </label>
              <input name="country" value={formData.country} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg ${errors.country ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500`} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
              {errors.phone && <span className="ml-2 text-xs text-red-500">{errors.phone}</span>}
            </label>
            <input name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg ${errors.phone ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-emerald-500`} placeholder="10-digit number" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Landmark (optional)
            </label>
            <input name="landmark" value={formData.landmark} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Nearby notable location" />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button onClick={onClose} className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium">
              Cancel
            </button>
            <button onClick={onSave} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium">
              Save Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressFormModal;