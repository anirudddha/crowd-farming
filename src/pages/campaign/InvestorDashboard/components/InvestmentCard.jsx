// src/pages/Dashboard/InvestorDashboard/components/InvestmentCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const InvestmentCard = ({ investment, onOpenRefundModal }) => {
  return (
    // Base is now a very light off-white (bg-gray-50) for a softer feel than pure white
    <div className="relative bg-gray-100 rounded-xl border-2 border-gray-300 shadow-lg hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 flex flex-col overflow-hidden group">
      
      {/* Subtle gray dot pattern for texture on the light background */}
      <div className="absolute inset-0 opacity-60">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="light-dotted-pattern" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="6" cy="6" r="1" fill="rgb(229 231 235)" /></pattern></defs><rect width="100%" height="100%" fill="url(#light-dotted-pattern)" /></svg>
      </div>

      {/* Content */}
      <div className="relative p-6 flex flex-col flex-grow z-10">
        <div className="flex-grow">
          {/* Title in brand green, now darker for readability */}
          <p className="text-sm font-medium text-green-700">INVESTMENT</p>
          <h3 className="text-xl font-semibold text-gray-900 mt-1" title={investment.farmName}>
            {investment.farmName}
          </h3>
          {/* Sub-heading in a standard dark gray */}
          <p className="text-gray-500 text-xs mt-4">Amount Invested</p>
          <p className="text-5xl font-bold text-gray-800 mt-1">
            {/* The Rupee symbol is now in brand green */}
            <span className="text-green-600">₹</span>{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(investment.amount)}
          </p>
        </div>

        {/* Footer with actions and details - STRUCTURE IS IDENTICAL TO THE DARK THEME */}
        {/* Border is now a standard light gray */}
        <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="space-y-3 mb-4">
                <Link
                    to={`/invested-farm-details/${investment.campaignId._id}/${investment._id}`}
                    className="w-full text-center px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 hover:bg-green-700"
                >
                    View Timeline & Updates
                </Link>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => onOpenRefundModal(investment._id)}
                        className="w-full px-3 py-2 bg-gray-200 hover:bg-red-100 text-gray-800 hover:text-red-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        Request Refund
                    </button>
                    <Link
                        to={`/campaign/${investment.campaignId?._id}`}
                        className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-colors text-center"
                    >
                        Campaign Details
                    </Link>
                </div>
            </div>
            {/* Darker text for the footer metadata */}
            <div className="text-center text-xs text-gray-500 font-mono">
                {new Date(investment.date).toLocaleDateString()} | ID: {investment._id.slice(-8).toUpperCase()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCard;