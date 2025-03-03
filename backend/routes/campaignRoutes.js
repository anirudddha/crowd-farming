const express = require('express');
const Razorpay = require("razorpay");

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
  RazorInvestment,
  getReciept
} = require('../controllers/campaignController');

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
router.put('/editCampaign', updateCampaign);

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

// raise investment usign razorpay
router.post('/razorInvestment', RazorInvestment);

// for geting recipt of the payments
router.get('/getReciept', getReciept);

module.exports = router;
