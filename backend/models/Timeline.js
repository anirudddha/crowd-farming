const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  // You can store a custom date for the update
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // Array of image URLs (or file paths) associated with this update
  images: [{
    type: String,
  }],
}, { timestamps: true }); // timestamps will add createdAt/updatedAt

module.exports = mongoose.model('Timeline', timelineSchema);
