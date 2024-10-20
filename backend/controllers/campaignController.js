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

exports.getCampaignsById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.invest = async (req, res) => {
  const { amount, userId } = req.body; // Extract investment amount and user ID from request

  try {
    // Update the campaign's raisedAmount atomically
    const campaign = await Campaign.findByIdAndUpdate(
      userId, // Campaign ID from route params
      { $inc: { raisedAmount: amount } }, // Increment raisedAmount
      { new: true } // Return the updated document
    );

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Track the investment in the user's investments array
    // await User.findByIdAndUpdate(
    //   userId,
    //   { $push: { investments: { campaignId: campaign._id, amount } } }, // Add investment entry
    //   { new: true } // Return the updated document
    // );

    res.json({ message: 'Investment successful!', campaign });
  } catch (error) {
    console.error('Investment error:', error);
    res.status(500).json({ message: 'Server error' });
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
