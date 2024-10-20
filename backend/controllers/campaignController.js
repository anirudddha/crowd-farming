const Campaign = require('../models/Campaign');
const express = require('express');
const app = express();
app.use(express.json());

// Get all campaigns
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new campaign
exports.createCampaign = async (req, res) => {
  const { name, description, targetAmount, raisedAmount, location } = req.body;
 // Extract the user ID from the authenticated user
  const userId = req.user; // Use optional chaining to avoid TypeError
  // console.log(req.user);
  try {
    const newCampaign = new Campaign({
      name,
      description,
      targetAmount,
      raisedAmount,
      location,
      userId, // Add userId to the campaign
    });

    const campaign = await newCampaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// Update an existing campaign
exports.updateCampaign = async (req, res) => {
  const { id } = req.params;
  const { name, description, targetAmount, raisedAmount, location } = req.body;

  try {
    const campaign = await Campaign.findByIdAndUpdate(
      id,
      { name, description, targetAmount, raisedAmount, location },
      { new: true } // Return the updated document
    );

    if (!campaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a campaign
exports.deleteCampaign = async (req, res) => {
  const { id } = req.params;

  try {
    const campaign = await Campaign.findByIdAndDelete(id);
    
    if (!campaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }

    res.json({ msg: 'Campaign removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
