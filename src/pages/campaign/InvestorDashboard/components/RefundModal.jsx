// src/pages/Dashboard/InvestorDashboard/components/RefundModal.js
import React from 'react';

const RefundModal = ({ isVisible, onClose, onSubmit, message, setMessage, isLoading }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl transform transition-all">
        <h4 className="text-xl font-semibold mb-4 text-gray-800">Request a Refund</h4>
        <p className="text-sm text-gray-600 mb-4">Please provide a clear reason for your refund request. This will be sent to the campaign owner for review.</p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g., Change in financial situation, concerns about the project..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 h-32 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          disabled={isLoading}
        />
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} disabled={isLoading} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition">Cancel</button>
          <button 
            onClick={onSubmit} 
            disabled={!message || isLoading} 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:bg-red-300 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;