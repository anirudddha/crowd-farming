// src/pages/Dashboard/InvestorDashboard/components/CampaignCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const FallbackImage = "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80";

const CampaignCard = ({ campaign, onOpenModal, onDeleteCampaign }) => {
  const raisedPercentage = Math.round((campaign.raisedAmount / campaign.fundingGoal) * 100);

  return (
    <div className="relative border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg group transition-all duration-300 ease-in-out hover:shadow-green-200">
      
      {/* Container that creates the aspect ratio using padding-bottom */}
      {/* pb-[75%] creates a 4:3 aspect ratio, which is standard and looks great */}
      <div className="relative w-full pb-[85%]">
        <img
          src={campaign.visuals[0]?.url || FallbackImage}
          alt={campaign.campaignTitle}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      {/* "Frosted Glass" Content Panel */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-white/80 backdrop-blur-xl border-t border-white/50">
          
          {/* Header: Title and Location */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800" title={campaign.campaignTitle}>
              {campaign.campaignTitle}
            </h3>
            <p className="text-sm text-gray-600">{campaign.farmLocation}</p>
          </div>

          {/* Progress and Stats */}
          <div className="mb-4">
            <div className="flex justify-between items-center text-sm font-semibold mb-1">
                <span className="text-green-700">{raisedPercentage}% Funded</span>
                <span className="text-gray-700">
                  ₹{new Intl.NumberFormat('en-IN').format(campaign.raisedAmount)}
                </span>
            </div>
            <div className="w-full bg-green-900/10 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${raisedPercentage}%` }}/>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
                onClick={() => onOpenModal(campaign, 'view')}
                className="col-span-2 w-full text-center py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                Manage
            </button>
            <Link to={`/add-timeline-update/${campaign._id}`} className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5" title="Add Update">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
              <span>Update</span>
            </Link>
            <button onClick={() => onOpenModal(campaign, 'edit')} className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5" title="Edit Campaign">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                <span>Edit</span>
            </button>
            <button onClick={() => onDeleteCampaign(campaign._id)} className="col-span-2 w-full mt-1 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5" title="Delete Campaign">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                <span>Delete</span>
            </button>
          </div>
      </div>
    </div>
  );
};

export default CampaignCard;