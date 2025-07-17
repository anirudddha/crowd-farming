import React from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'; // Icons for verification status

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper to render the expected returns in a readable format
const RenderReturns = ({ returns }) => {
  if (!returns) return <span className="text-sm font-medium text-gray-800">N/A</span>;

  let returnText = 'N/A';
  if (returns.type === 'Percentage Range') {
    returnText = `${returns.min}% - ${returns.max}%`;
  } else if (returns.type === 'Fixed Multiple') {
    returnText = `${returns.min}x Fixed Multiple`;
  }

  return (
    <div>
      <p className="text-sm font-medium text-gray-800">{returnText}</p>
      {returns.description && <p className="text-xs text-gray-500 mt-1">{returns.description}</p>}
    </div>
  );
};

// Helper to get status color and text
const getStatusInfo = (status) => {
  switch (status) {
    case 'Active':
      return { text: 'Active', color: 'bg-green-600', textColor: 'text-green-800', bgColor: 'bg-green-50' };
    case 'Funded':
      return { text: 'Fully Funded', color: 'bg-blue-600', textColor: 'text-blue-800', bgColor: 'bg-blue-50' };
    case 'Completed':
      return { text: 'Completed', color: 'bg-purple-600', textColor: 'text-purple-800', bgColor: 'bg-purple-50' };
    case 'Cancelled':
      return { text: 'Cancelled', color: 'bg-red-600', textColor: 'text-red-800', bgColor: 'bg-red-50' };
    default:
      return { text: 'Draft', color: 'bg-gray-500', textColor: 'text-gray-800', bgColor: 'bg-gray-50' };
  }
};

const DashboardView = ({ campaign, closeModal }) => {
  if (!campaign) return null;

  const progress = (campaign.raisedAmount / campaign.fundingGoal) * 100;
  const statusInfo = getStatusInfo(campaign.status);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-4 rounded-lg ${statusInfo.bgColor}`}>
          <h4 className={`text-sm font-semibold ${statusInfo.textColor} mb-2`}>Funding Progress</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-2xl font-bold ${statusInfo.textColor.replace('800', '600')}`}>
                {formatCurrency(campaign.raisedAmount)}
              </p>
              <p className="text-sm text-gray-600">of {formatCurrency(campaign.fundingGoal)} goal</p>
            </div>
            <div className="w-20 h-20">
              <CircularProgress value={progress} strokeWidth={8} className={statusInfo.textColor.replace('800', '600')} />
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${statusInfo.bgColor}`}>
          <h4 className={`text-sm font-semibold ${statusInfo.textColor} mb-2`}>Campaign Status</h4>
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-2 h-2 ${statusInfo.color} rounded-full`}></div>
            <p className="text-sm font-medium text-gray-700">{statusInfo.text}</p>
          </div>
          {campaign.isVerified ? (
            <div className="flex items-center space-x-2 text-green-700">
              <FiCheckCircle />
              <span className="text-xs font-medium">Verified Campaign</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-red-700">
              <FiXCircle />
              <span className="text-xs font-medium">Not Verified</span>
            </div>
          )}
        </div>

        <div className={`p-4 rounded-lg ${statusInfo.bgColor}`}>
          <h4 className={`text-sm font-semibold ${statusInfo.textColor} mb-2`}>Investment Details</h4>
          <InfoItem label="Min. Investment" value={formatCurrency(campaign.minInvestment)} />
          <div className="py-2">
            <span className="text-sm text-gray-600">Expected Returns</span>
            <RenderReturns returns={campaign.expectedReturns} />
          </div>
        </div>
      </div>

      {/* Story Section */}
      <Section title="Campaign Story">
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {campaign.story || 'No story provided.'}
        </p>
      </Section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Section title="Farm Information">
            <InfoItem label="Farm Name" value={campaign.farmName} />
            <InfoItem label="Location" value={campaign.farmLocation} />
            <InfoItem label="Farm Size" value={`${campaign.farmSize?.value || 'N/A'} ${campaign.farmSize?.unit || ''}`} />
          </Section>

          <Section title="Agriculture Details">
            <InfoItem label="Crop Types" value={Array.isArray(campaign.cropTypes) ? campaign.cropTypes.join(', ') : 'N/A'} />
            <InfoItem label="Farming Methods" value={campaign.farmingMethods} />
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Campaign Timeline">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">Start Date</p>
                <p className="text-sm font-medium">{new Date(campaign.startDate).toLocaleDateString()}</p>
              </div>
              <div className="w-8 border-t border-gray-300 mx-2"></div>
              <div>
                <p className="text-xs text-gray-500 mb-1">End Date</p>
                <p className="text-sm font-medium">{new Date(campaign.endDate).toLocaleDateString()}</p>
              </div>
            </div>
          </Section>

          <Section title="Visual Documentation">
            <div className="grid grid-cols-3 gap-4">
              {campaign.visuals?.length > 0 ? (
                campaign.visuals.map((visual, index) => (
                  <img key={visual.public_id || index} src={visual.url} alt={`Visual ${index + 1}`} className="w-full h-24 object-cover rounded-lg border" />
                ))
              ) : (
                <p className="col-span-3 text-gray-500 text-sm">No visuals available.</p>
              )}
            </div>
          </Section>
        </div>
      </div>

      {/* Full Width Sections */}
      <Section title="Fund Utilization Plan">
        <p className="text-sm text-gray-700 whitespace-pre-line">{campaign.fundUsage || 'Not specified.'}</p>
      </Section>
      <Section title="Expected Impact">
        <p className="text-sm text-gray-700 whitespace-pre-line">{campaign.impactMetrics || 'Not specified.'}</p>
      </Section>
      <Section title="Risk Factors">
        <p className="text-sm text-gray-700 whitespace-pre-line">{campaign.riskFactors || 'Not specified.'}</p>
      </Section>

      <div className="flex justify-end mt-4 border-t pt-4">
        <button onClick={closeModal} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
          Close
        </button>
      </div>
    </div>
  );
};

// --- Helper Components ---

const Section = ({ title, children }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200">
    <h4 className="text-sm font-semibold text-gray-800 mb-3">{title}</h4>
    {children}
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm font-medium text-gray-800 text-right">{value}</span>
  </div>
);

const CircularProgress = ({ value, strokeWidth = 8, className }) => (
  <div className="relative w-full h-full">
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <circle className="text-gray-200" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
      <circle
        className={className} strokeWidth={strokeWidth} strokeLinecap="round" stroke="currentColor" fill="transparent"
        r="45" cx="50" cy="50"
        strokeDasharray={`${2 * Math.PI * 45}`}
        strokeDashoffset={`${2 * Math.PI * 45 * (1 - (value || 0) / 100)}`}
        transform="rotate(-90 50 50)"
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-sm font-bold">{Math.round(value || 0)}%</span>
    </div>
  </div>
);

export default DashboardView;