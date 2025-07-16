const express = require('express');
const Razorpay = require("razorpay");
const upload = require('../middleware/multer'); // Import multer middleware


const router = express.Router();
const {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaignsById,
  invest,
  storeInvestment,
  getFilterOptions,
  refundRequest,
  getReciept,
  getInvestmentDetails,
} = require('../controllers/campaignController');

const timelineController = require('../controllers/timelineController');

const auth = require('../middleware/userAuth');

// GET all campaigns
router.get('/', getCampaigns);

// GET campaign by id
router.get('/:id', getCampaignsById);

//Invest amount
router.put('/:id/raisedAmount', invest);

// POST a new campaign
router.post('/', auth, createCampaign); // Ensure auth middleware is used here

// PUT (update) a campaign
router.put('/editCampaign/:id', updateCampaign);

// DELETE a campaign
// router.delete('/:id', deleteCampaign);

// Store investment details
router.post('/:id/investment', auth, storeInvestment);

// Refund
router.post('/refundRequest', refundRequest);


// GET dynamic filter options
router.get('/filters/options', getFilterOptions);

//delete campaign
router.delete('/deleteCampaign', deleteCampaign);

router.get('/:id/investment-details', getInvestmentDetails);

router.post(
    '/:id/timeline-update',
    auth, // <-- Protect this route
    upload.array('images', 5), // 'images' is the field name, 5 is the max count
    timelineController.addTimelineUpdate
);

// Delete a specific timeline update
router.delete(
    '/:campaignId/timeline-update/:updateId',
    auth, // <-- Protect this route
    timelineController.deleteTimelineUpdate
);

// Update a specific timeline update
router.put(
    '/:campaignId/timeline-update/:updateId',
    auth,
    timelineController.updateTimelineUpdate
);

// GET all timeline updates for a campaign
router.get(
    '/:id/timeline',
    timelineController.getTimeline
);

module.exports = router;
