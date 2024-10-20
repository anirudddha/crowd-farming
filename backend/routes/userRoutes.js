const express = require('express');
// const { createUser } = require('../controllers/userController');

const router = express.Router();
const Campaign = require('../models/Campaign'); // Assuming you have a Campaign model
const auth = require('../middleware/userAuth'); // Middleware to verify token

// router.post('/', createUser);

// Route to get campaigns by logged-in user
router.get('/user-campaigns', auth, async (req, res) => {
    try {
        const campaigns = await Campaign.find({ userId: req.user }); // Fetch campaigns by user ID
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
