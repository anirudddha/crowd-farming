import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiTarget, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import { FaIndianRupeeSign } from "react-icons/fa6";

const FarmCard = ({ farm }) => {
  const isFunded = parseInt(farm.raisedAmount, 10) + parseInt(farm.minInvestment, 10) >= parseInt(farm.fundingGoal, 10);
  const imageUrl = farm.visuals[0] || 'https://images.pexels.com/photos/96715/pexels-photo-96715.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Image Section with Overlay */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl.url} 
          alt={farm.farmName} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* Funding Status Badge */}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
          isFunded ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {isFunded ? 'Funded' : 'Seeking Funds'}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">{farm.farmName}</h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {farm.impactMetrics || 'Join us in supporting sustainable agriculture and community development.'}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <FiMapPin className="w-5 h-5 text-emerald-600" />
            <span className="text-sm text-gray-600 truncate">{farm.farmLocation}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiTarget className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-gray-600">Goal: ₹{farm.fundingGoal}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" 
              style={{ width: `${Math.min((farm.raisedAmount / farm.fundingGoal) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <Link 
          to={`/campaign/${farm._id}`}
          className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-colors ${
            isFunded 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isFunded ? (
            <>
              <FiCheckCircle className="w-5 h-5" />
              <span>View Completed</span>
            </>
          ) : (
            <>
              <FaIndianRupeeSign className="w-5 h-5" />
              <span>Invest Now</span>
            </>
          )}
        </Link>
      </div>
    </div>
  );
};

export default FarmCard;