const Campaign = require('../models/Campaign');
const Investment = require('../models/Investment');
const Refund = require('../models/Refund');
const express = require('express');
const app = express();
app.use(express.json());
const path = require('path');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: 'duz18zmq0', 
  api_key: '396247895111179', 
  api_secret: 'lgi9nLxOZs3FoFv2Kh9lPfFlz6M'
});

// Set up multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to upload a file buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'campaign_visuals' },
      (error, result) => error ? reject(error) : resolve({ url: result.secure_url, public_id: result.public_id })
    );
    stream.end(buffer);
  });
};

// Get distinct filter options for a given field based on a search term
exports.getFilterOptions = async (req, res) => {
  const { field, term } = req.query;
  console.log(`Fetching options for field: ${field}, with term: ${term}`);
  
  if (!field) return res.status(400).json({ message: 'Field and search term are required' });
  
  try {
    const regex = new RegExp(term, 'i');
    const options = await Campaign.distinct(field, { [field]: { $regex: regex } });
    console.log(`Fetched options for ${field}:`, options);
    res.json(options);
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).send('Server Error');
  }
};

// Get a paginated list of campaigns with optional filtering
exports.getCampaigns = async (req, res) => {
  const { page = 1, limit = 12, farmLocation, cropTypes, farmingMethods, projectNeeds, expectedReturns } = req.query;
  const query = {};
  if (farmLocation) query.farmLocation = farmLocation;
  if (cropTypes) query.cropTypes = cropTypes;
  if (farmingMethods) query.farmingMethods = farmingMethods;
  if (projectNeeds) query.projectNeeds = projectNeeds;
  if (expectedReturns) query.expectedReturns = expectedReturns;
  
  try {
    const campaigns = await Campaign.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    res.json(campaigns);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get a single campaign by its ID
exports.getCampaignsById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Invest in a campaign by incrementing its raised amount
exports.invest = async (req, res) => {
  const { amount, userId } = req.body; // userId here represents the campaign ID
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      userId,
      { $inc: { raisedAmount: amount } },
      { new: true }
    );
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json({ message: 'Investment successful!', campaign });
  } catch (error) {
    console.error('Investment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new campaign with file uploads to Cloudinary
exports.createCampaign = [
  upload.array('visuals'),
  async (req, res) => {
    const { farmerName, phoneNumber, email, farmName, farmLocation, farmSize, campaignTitle, fundingGoal, minInvestment, expectedReturns, cropTypes, farmingMethods, startDate, endDate, fundUsage, impactMetrics } = req.body;
    const userId = req.user;
    try {
      let visuals = [];
      if (req.files && req.files.length > 0) {
        visuals = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
      }
      
      const newCampaign = new Campaign({
        farmerName,
        phoneNumber,
        email,
        farmName,
        farmLocation,
        farmSize,
        campaignTitle,
        fundingGoal,
        minInvestment,
        expectedReturns,
        cropTypes,
        farmingMethods,
        startDate,
        endDate,
        fundUsage,
        impactMetrics,
        visuals,
        userId,
        raisedAmount: 0
      });
      
      const campaign = await newCampaign.save();
      res.status(201).json(campaign);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
];

// Update an existing campaign
exports.updateCampaign = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ msg: 'Missing campaign ID (_id).' });
    }

    // Convert textual fields from req.body into an object
    // ignoring visuals, which will be handled separately
    const updatedFields = { ...req.body };
    delete updatedFields.visuals;

    // 1) If the request includes new files, upload them to Cloudinary
    let newVisuals = [];
    if (req.files && req.files.length > 0) {
      newVisuals = await Promise.all(
        req.files.map(file => uploadToCloudinary(file.buffer))
      );
    }

    // 2) Find the existing campaign
    const existingCampaign = await Campaign.findById(_id);
    if (!existingCampaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }

    // 3) Merge or replace visuals
    //    Decide how you want to handle existing visuals. For example:
    //    Option A: Append new visuals to existing
    //    Option B: Replace existing visuals with new
    // Here, we demonstrate Option A: append new visuals
    let updatedVisuals = existingCampaign.visuals;
    if (newVisuals.length > 0) {
      updatedVisuals = [...updatedVisuals, ...newVisuals];
    }

    // 4) Update the campaign fields
    Object.keys(updatedFields).forEach((key) => {
      existingCampaign[key] = updatedFields[key];
    });
    existingCampaign.visuals = updatedVisuals;

    // 5) Save updated campaign
    const updatedCampaign = await existingCampaign.save();

    res.json(updatedCampaign);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Delete a campaign
exports.deleteCampaign = async (req, res) => {
  const id = req.body.id;
  try {
    const campaign = await Campaign.findByIdAndDelete(id);
    if (!campaign) return res.status(404).json({ msg: 'Campaign not found' });
    res.json({ msg: 'Campaign removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Store investment details in the database
exports.storeInvestment = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user;
  const campaignId = req.params.id;
  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ msg: 'Campaign not found' });
    const investment = new Investment({
      userId,
      campaignId,
      farmName: campaign.campaignTitle,
      amount,
    });
    await investment.save();
    res.json({ msg: 'Investment saved successfully', investment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error saving investment details' });
  }
};

// Submit a refund request for an investment
exports.refundRequest = async (req, res) => {
  const { Reason, investId, campaignId, userId } = req.body;
  try {
    const invest = await Investment.findById(investId);
    if (!invest) return res.status(404).json({ msg: 'Investment not found' });
    const newRefund = new Refund({
      Reason,
      investId: invest._id,
      campaignId: invest.campaignId,
      userId: invest.userId,
    });
    await newRefund.save();
    res.json({ msg: 'Refund request successfully submitted', refund: newRefund });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error saving refund request' });
  }
};
