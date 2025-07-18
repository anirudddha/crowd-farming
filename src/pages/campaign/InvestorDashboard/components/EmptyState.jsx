// src/pages/Dashboard/InvestorDashboard/components/EmptyState.js
import React from 'react';

const EmptyState = ({ message, ctaText, ctaLink }) => {
  return (
    <div className="text-center bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z" />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">{message}</h3>
      {ctaText && ctaLink && (
        <div className="mt-6">
          <a
            href={ctaLink}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {ctaText}
          </a>
        </div>
      )}
    </div>
  );
};

export default EmptyState;