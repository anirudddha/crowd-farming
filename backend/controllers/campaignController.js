// --- MODIFIED IMPORTS ---
// Assuming cloudinary and multer are configured and exported from these paths
const cloudinary = require('../config/cloudinary'); 
const upload = require('../middleware/multer');

const Campaign = require('../models/Campaign');
const Investment = require('../models/Investment');
const Refund = require('../models/Refund');

// --- Helper function for upload remains the same ---
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'campaign_visuals' },
      (error, result) => error ? reject(error) : resolve({ url: result.secure_url, public_id: result.public_id })
    );
    stream.end(buffer);
  });
};


// --- REFACTORED CAMPAIGN CONTROLLERS ---

/**
 * @desc    Create a new campaign
 * @route   POST /api/campaigns
 * @access  Private (Farmer)
 */
exports.createCampaign = [
  upload.array('visuals', 5),
  async (req, res) => {
    // Destructure based on the NEW schema and form fields
    const {
      campaignTitle, story, farmName, farmLocation, farmSizeValue, farmSizeUnit,
      fundingGoal, minInvestment, returnsType, returnsMin, returnsMax, returnsDescription,
      cropTypes, farmingMethods, startDate, endDate, fundUsage, impactMetrics, riskFactors
    } = req.body;
    
    // Get user ID from authentication middleware
    const userId = req.user;

    try {
      let visuals = [];
      if (req.files && req.files.length > 0) {
        visuals = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
      }
      
      const newCampaign = new Campaign({
        userId,
        campaignTitle,
        story,
        farmName,
        farmLocation,
        farmSize: { value: farmSizeValue, unit: farmSizeUnit },
        fundingGoal,
        minInvestment,
        expectedReturns: {
          type: returnsType,
          min: returnsMin,
          max: returnsMax,
          description: returnsDescription,
        },
        // Handle cropTypes if it's a comma-separated string from a form
        cropTypes: Array.isArray(cropTypes) ? cropTypes : cropTypes.split(',').map(s => s.trim()),
        farmingMethods,
        startDate,
        endDate,
        fundUsage,
        impactMetrics,
        riskFactors,
        visuals,
        // raisedAmount and status have defaults in the schema ('0' and 'Draft')
      });
      
      const campaign = await newCampaign.save();
      res.status(201).json(campaign);
    } catch (err) {
      console.error('Error creating campaign:', err.message);
      if (err.name === 'ValidationError') {
          return res.status(400).json({ message: err.message });
      }
      res.status(500).send('Server Error');
    }
  },
];

/**
 * @desc    Get all active campaigns with filtering and pagination
 * @route   GET /api/campaigns
 * @access  Public
 */
exports.getCampaigns = async (req, res) => {
  const { page = 1, limit = 12, farmLocation, cropTypes, farmingMethods } = req.query;
  
  // Build query: Always filter for 'Active' campaigns for public view
  const query = { status: 'Active' };
  
  if (farmLocation) query.farmLocation = { $regex: farmLocation, $options: 'i' };
  if (cropTypes) query.cropTypes = cropTypes;
  if (farmingMethods) query.farmingMethods = farmingMethods;
  
  try {
    const campaigns = await Campaign.find(query)
      .populate('userId', 'name profilePicture') // Populate farmer info for display
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await Campaign.countDocuments(query);
    
    res.json({
      campaigns,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Get a single campaign by ID
 * @route   GET /api/campaigns/:id
 * @access  Public
 */
exports.getCampaignsById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('userId', 'name email profilePicture'); // Get farmer details for detail page

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


/**
 * @desc    Update a campaign
 * @route   PUT /api/campaigns/:id
 * @access  Private (Owner of Campaign)
 */
exports.updateCampaign = [
  upload.array('visuals'),
  async (req, res) => {
    try {
      const campaign = await Campaign.findById(req.params.id);

      if (!campaign) {
        return res.status(404).json({ msg: 'Campaign not found' });
      }

      // --- AUTHORIZATION CHECK ---
      if (campaign.userId.toString() !== req.user) {
        return res.status(403).json({ msg: 'User not authorized to update this campaign' });
      }
      
      // Dynamically build update object from request body
      const updateData = { ...req.body };
      
      // Handle structured data if provided
      if (req.body.farmSizeValue) {
        updateData.farmSize = { value: req.body.farmSizeValue, unit: req.body.farmSizeUnit };
      }
      if (req.body.returnsType) {
        updateData.expectedReturns = { type: req.body.returnsType, min: req.body.returnsMin, max: req.body.returnsMax, description: req.body.returnsDescription };
      }
      if(req.body.cropTypes && !Array.isArray(req.body.cropTypes)){
        updateData.cropTypes = req.body.cropTypes.split(',').map(s => s.trim());
      }
      
      // Logic to handle visuals update (preserved from your original code)
      let existingVisuals = [];
      if (req.body.visuals) {
          try {
              existingVisuals = JSON.parse(req.body.visuals);
          } catch(e) {
              console.error("Error parsing existing visuals", e);
              existingVisuals = campaign.visuals; // Fallback to current visuals
          }
      } else {
          existingVisuals = campaign.visuals;
      }

      let newVisuals = [];
      if (req.files && req.files.length > 0) {
        newVisuals = await Promise.all(
          req.files.map(file => uploadToCloudinary(file.buffer))
        );
      }
      
      updateData.visuals = [...existingVisuals, ...newVisuals];

      const updatedCampaign = await Campaign.findByIdAndUpdate(
        req.params.id, 
        { $set: updateData }, 
        { new: true, runValidators: true }
      );
      
      res.status(200).json(updatedCampaign);
    } catch (err) {
      console.error(err.message);
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).send('Server Error');
    }
  }
];

/**
 * @desc    Delete a campaign
 * @route   DELETE /api/campaigns/:id
 * @access  Private (Owner of Campaign)
 */
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }

    // --- AUTHORIZATION CHECK ---
    if (campaign.userId.toString() !== req.user) {
        return res.status(403).json({ msg: 'User not authorized to delete this campaign' });
    }

    // --- BUSINESS RULE ---
    // Prevent deletion if the campaign has received funds.
    if (campaign.raisedAmount > 0) {
        return res.status(400).json({ msg: 'Cannot delete a campaign with existing investments. Consider closing it instead.' });
    }
    
    await Campaign.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Campaign removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


// --- UNCHANGED FUNCTIONS (As Requested) ---

// This function is now redundant if you implement a proper investment flow,
// but is kept here as per your request.
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

exports.getInvestmentDetails = async (req, res) => {
  const userId = req.user; // Assuming authentication middleware sets req.user
  const id = req.params.id;

  try {
    const investment = await Investment.findOne({ _id: id });

    if (!investment) {
      return res.status(404).json({ msg: 'No investment found for this campaign' });
    }

    res.json(investment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error fetching investment details' });
  }
};

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