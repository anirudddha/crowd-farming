const mongoose = require('mongoose');

// Define a sub-schema for each visual
const ImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    }
  },
  { _id: false } // We don't need an _id for each embedded image
);

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
      type: [ImageSchema], // Now storing objects with url and public_id
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    raisedAmount: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model('Campaign', CampaignSchema);
