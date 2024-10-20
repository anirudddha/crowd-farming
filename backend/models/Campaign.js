const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    raisedAmount: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
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
