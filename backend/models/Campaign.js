const mongoose = require('mongoose');

// Sub-schema for visual assets (unchanged, it's good)
const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false }
);

// Sub-schema for structured return expectations
const ReturnsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Percentage Range', 'Fixed Multiple'],
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      // Not required if it's a fixed multiple, but useful for ranges
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

// Sub-schema for periodic progress updates from the farmer
const UpdateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String }, // Optional image for the update
  },
  { timestamps: true } // Each update gets its own timestamp
);

const CampaignSchema = new mongoose.Schema(
  {
    // --- Core Campaign Details ---
    campaignTitle: {
      type: String,
      required: [true, 'Campaign title is required.'],
      trim: true,
    },
    story: {
      type: String,
      required: [true, 'Campaign story/description is required.'],
    },
    farmName: {
      type: String,
      required: true,
    },
    farmLocation: {
      type: String,
      required: true,
      index: true, // Index for faster location-based filtering
    },
    // --- Trust & Verification ---
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Links to the User model (the farmer)
      required: true,
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false, // Admin can set this to true after vetting
    },
    // --- Financials ---
    fundingGoal: {
      type: Number,
      required: true,
    },
    minInvestment: {
      type: Number,
      required: true,
    },
    raisedAmount: {
      type: Number,
      default: 0, // Starts at 0, updated by investments
    },
    expectedReturns: ReturnsSchema, // Using the structured sub-schema
    fundUsage: {
      type: String,
      required: [true, 'Description of fund usage is required.'],
    },
    // --- Agricultural Details ---
    farmSize: {
      value: { type: Number, required: true },
      unit: { type: String, enum: ['Acres', 'Hectares'], default: 'Acres' },
    },
    cropTypes: {
      type: [String], // An array for multiple crops
      required: true,
    },
    farmingMethods: {
      type: String,
      required: true,
    },
    // --- Lifecycle & Timeline ---
    status: {
      type: String,
      enum: [
        'Draft',             // Farmer is creating it
        'Pending Approval',  // Submitted for admin review
        'Active',            // Live and accepting funds
        'Funding Successful',// Goal met
        'Funding Failed',    // Goal not met by deadline
        'In Progress',       // Farming has started
        'Completed',         // Harvest done, returns being processed
        'Closed',            // All returns paid out
      ],
      default: 'Draft',
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    // --- Engagement & Reporting ---
    impactMetrics: {
      type: String,
      required: true,
    },
    riskFactors: {
      type: String, // A section for transparently listing risks
      required: [true, 'Risk disclosure is required.'],
    },
    visuals: [ImageSchema],
    updates: [UpdateSchema], // Array for farmers to post progress
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
    // To include virtuals when converting to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// --- VIRTUALS ---
// A virtual property to calculate funding progress on the fly
CampaignSchema.virtual('fundingProgress').get(function () {
  if (this.fundingGoal === 0) {
    return 0;
  }
  return (this.raisedAmount / this.fundingGoal) * 100;
});

// A virtual to check if the campaign is currently accepting investments
CampaignSchema.virtual('isAcceptingFunds').get(function () {
  return this.status === 'Active';
});


// Note: Removed farmerName, email, phoneNumber. This data should be populated from the referenced User model (`userId`)
// to avoid data redundancy and ensure it's always up-to-date.
// Example: `Campaign.findById(id).populate('userId', 'name email');`

module.exports = mongoose.model('Campaign', CampaignSchema);