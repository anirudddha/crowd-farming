const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema(
  {
    farmerName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    farmName: {
      type: String,
      required: true,
    },
    farmLocation: {
      type: String,
      required: true,
    },
    farmSize: {
      type: String,
      required: true,
    },
    campaignTitle: {
      type: String,
      required: true,
    },
    fundingGoal: {
      type: Number,
      required: true,
    },
    minInvestment: {
      type: Number,
      required: true,
    },
    expectedReturns: {
      type: String,
      required: true,
    },
    cropTypes: {
      type: String,
      required: true,
    },
    farmingMethods: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    fundUsage: {
      type: String,
      required: true,
    },
    impactMetrics: {
      type: String,
      required: true,
    },
    visuals: {
      type: [String], // Array to store paths to uploaded files
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model('Campaign', CampaignSchema);
