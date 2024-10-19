const express = require('express');
const router = express.Router();
const {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} = require('../controllers/campaignController');

// GET all campaigns
router.get('/', getCampaigns);

// POST a new campaign
router.post('/', createCampaign);

// PUT (update) a campaign
router.put('/:id', updateCampaign);

// DELETE a campaign
router.delete('/:id', deleteCampaign);

module.exports = router;
