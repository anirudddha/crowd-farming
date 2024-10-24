    const express = require('express');
    // const { createUser } = require('../controllers/userController');
    const User = require('../models/User');
    const router = express.Router();
    const Campaign = require('../models/Campaign'); // Assuming you have a Campaign model
    const auth = require('../middleware/userAuth'); // Middleware to verify token
    const Investment = require('../models/Investment'); // Import Investment model


    // router.post('/', createUser);

    // Route to get campaigns by logged-in user
    router.get('/user-campaigns', auth, async (req, res) => {
        try {
            const campaigns = await Campaign.find({ userId: req.user }); // Fetch campaigns by user ID

            const investments = await Investment.find({ userId: req.user }).populate('campaignId', 'name'); // Populate campaign name

            res.json({campaigns,investments});
        } catch (error) {
            res.status(500).json({ msg: 'Server error' });
        }
    });

    router.get('/user-profile', auth, async (req, res) => {
        try {
            const user = await User.findById(req.user).select('name email username'); // Select only relevant fields
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ msg: 'Server error' });
        }
    });

    module.exports = router;
