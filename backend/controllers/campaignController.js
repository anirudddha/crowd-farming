const Campaign = require('../models/Campaign');
const Investment = require('../models/Investment');
const express = require('express');
const app = express();
app.use(express.json());
const multer = require('multer');
const path = require('path');


exports.getFilterOptions = async (req, res) => {
  const { field, term } = req.query;

  // Log the inputs to verify
  console.log(`Fetching options for field: ${field}, with term: ${term}`);

  if (!field || !term) {
    return res.status(400).json({ message: 'Field and search term are required' });
  }

  try {
    // Make the regex case-insensitive and global for all matches
    const regex = new RegExp(term, 'i');
    const options = await Campaign.distinct(field, { [field]: { $regex: regex } });

    console.log(`Fetched options for ${field}:`, options); // Log fetched options

    res.json(options);
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).send('Server Error');
  }
};


exports.getCampaigns = async (req, res) => {
  const { page = 1, limit = 12, farmLocation, cropTypes, farmingMethods, projectNeeds, expectedReturns } = req.query;

  const query = {};
  if (farmLocation) query.farmLocation = farmLocation;
  if (cropTypes) query.cropTypes = cropTypes; // Make sure your Campaign model has this field
  if (farmingMethods) query.farmingMethods = farmingMethods; // Make sure your Campaign model has this field
  if (projectNeeds) query.projectNeeds = projectNeeds; // Make sure your Campaign model has this field
  if (expectedReturns) query.expectedReturns = expectedReturns; // Make sure your Campaign model has this field

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
    res.status(500).json({ message: 'Server error' },error);
  }
};

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // File naming convention
  },
});

// Initialize multer
const upload = multer({ storage });

// Create a new campaign
exports.createCampaign = [
  upload.array('visuals'), // Use multer to handle multiple file uploads
  async (req, res) => {
    const {
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
      visuals
    } = req.body;

    const userId = req.user; // Assuming req.user is populated with authenticated user info

    try {

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
        visuals, // Add visuals to the campaign
        userId, // Add userId to the campaign
        raisedAmount:0,
      });

      // Save the new campaign to the database
      const campaign = await newCampaign.save();
      res.status(201).json(campaign); // Respond with the created campaign
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error'); // Respond with a server error
    }
  },
];


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

// Store investment details
exports.storeInvestment = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user; // Retrieved from JWT middleware
  const campaignId = req.params.id;

  try {
    // Fetch the campaign details to get the farm (campaign) name
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }
    // console.log(campaign);
    // console.log(campaign.name);
    // Create a new investment record with farm name
    const investment = new Investment({
      userId,
      campaignId,
      farmName: campaign.name, // Store the campaign (farm) name
      amount,
    });

    // Save investment to the database
    
    await investment.save();

    res.json({ msg: 'Investment saved successfully', investment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error saving investment details' });
  }
};
