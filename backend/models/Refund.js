const mongoose = require('mongoose');

const RefundSchema = new mongoose.Schema(
  {
    Reason: {
      type: String,
      required: true, // Ensures a reason is always provided
    },
    investId: {
      type: String, 
      required: true, // Make it mandatory if refunds must be tied to an investment
    },
    campaignId: {
        type: String, 
      ref: 'Campaign',
      required: true, // Make it mandatory if refunds must be tied to a campaign
    },
    userId: {
    type: String,
      ref: 'User',
      required: true, // Ensure the refund is tied to a user
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

module.exports = mongoose.model('Refund', RefundSchema);
