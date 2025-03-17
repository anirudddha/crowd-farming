import React from 'react';

const DashboardView = ({ campaign, closeModal }) => {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Funding Progress</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                ${campaign.raisedAmount}
                <span className="text-sm text-gray-500 ml-1">raised</span>
              </p>
              <p className="text-sm text-gray-600">of ${campaign.fundingGoal} goal</p>
            </div>
            <div className="w-20 h-20">
              <CircularProgress
                value={(campaign.raisedAmount / campaign.fundingGoal) * 100}
                strokeWidth={8}
                className="text-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-green-800 mb-2">Campaign Status</h4>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <p className="text-sm font-medium text-gray-700">Active</p>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-purple-800 mb-2">Investment Details</h4>
          <p className="text-sm text-gray-700">
            Minimum: <span className="font-medium">${campaign.minInvestment}</span>
          </p>
          <p className="text-sm text-gray-700">
            Returns: <span className="font-medium">{campaign.expectedReturns}</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <Section title="Farmer Information">
            <InfoItem label="Name" value={campaign.farmerName} />
            <InfoItem label="Farm Name" value={campaign.farmName} />
            <InfoItem label="Location" value={campaign.farmLocation} />
            <InfoItem label="Farm Size" value={campaign.farmSize} />
          </Section>

          <Section title="Campaign Timeline">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">Start Date</p>
                <p className="text-sm font-medium">
                  {new Date(campaign.startDate).toLocaleDateString()}
                </p>
              </div>
              <div className="w-8 border-t border-gray-300 mx-2"></div>
              <div>
                <p className="text-xs text-gray-500 mb-1">End Date</p>
                <p className="text-sm font-medium">
                  {new Date(campaign.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Section title="Agriculture Details">
            <InfoItem label="Crop Types" value={campaign.cropTypes} />
            <InfoItem label="Farming Methods" value={campaign.farmingMethods} />
          </Section>

          <Section title="Visual Documentation">
            <div className="grid grid-cols-3 gap-4">
              {campaign.visuals?.length > 0 ? (
                campaign.visuals.map((visual, index) =>
                  visual.url ? (
                    <img
                      key={index}
                      src={visual.url}
                      alt={`Visual ${index}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                  ) : (
                    <div
                      key={index}
                      className="p-2 bg-gray-50 rounded-lg text-xs text-gray-600 break-words"
                    >
                      {visual}
                    </div>
                  )
                )
              ) : (
                <p className="text-gray-500 text-sm">No visuals available</p>
              )}
            </div>
          </Section>
        </div>
      </div>

      {/* Full Width Sections */}
      <Section title="Fund Utilization Plan">
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {campaign.fundUsage}
        </p>
      </Section>

      <Section title="Expected Impact">
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {campaign.impactMetrics}
        </p>
      </Section>

      <div className="flex justify-end mt-4">
        <button onClick={closeModal} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          Close
        </button>
      </div>
    </div>
  );
};


const Section = ({ title, children }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">{title}</h4>
        {children}
    </div>
);



const InfoItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm font-medium text-gray-800">{value}</span>
  </div>
);


const FormInput = ({ label, type = 'text', ...props }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      {...props}
      className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);

const CircularProgress = ({ value, strokeWidth = 8, className }) => (
  <div className="relative w-full h-full">
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <circle
        className="text-gray-200"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r="45"
        cx="50"
        cy="50"
      />
      <circle
        className={className}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r="45"
        cx="50"
        cy="50"
        strokeDasharray={`${2 * Math.PI * 45}`}
        strokeDashoffset={`${2 * Math.PI * 45 * (1 - value / 100)}`}
        transform="rotate(-90 50 50)"
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-sm font-bold">{Math.round(value)}%</span>
    </div>
  </div>
);



export default DashboardView;
