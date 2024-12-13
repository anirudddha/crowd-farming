const mongoose = require('mongoose');

const CampaignRequest = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    require: true
  }
});

module.exports = mongoose.model('CampaignRequest', CampaignRequest);
