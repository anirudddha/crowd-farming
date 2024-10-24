const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign', // Assuming you have a Campaign model
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically store the date of investment
  },
});

module.exports = mongoose.model('Investment', investmentSchema);
