const express = require('express');
// const { createUser } = require('../controllers/userController');
const User = require('../models/User');
const router = express.Router();
const Campaign = require('../models/Campaign'); // Assuming you have a Campaign model
const auth = require('../middleware/userAuth'); // Middleware to verify token
const Investment = require('../models/Investment'); // Import Investment model
const {
    updateName,
    updateAddress,
    campaignRequestSave,
    deleteAddress,
    editPhone,
    updateProfilePicture, // Import the new function
} = require('../controllers/userController');

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = multer.memoryStorage();

// router.post('/', createUser);

// Route to get campaigns by logged-in user
router.get('/user-campaigns', auth, async (req, res) => {
    try {
        const campaigns = await Campaign.find({ userId: req.user }); // Fetch campaigns by user ID

        const investments = await Investment.find({ userId: req.user }).populate('campaignId', 'name'); // Populate campaign name

        res.json({ campaigns, investments });
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

router.get('/user-profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user); // Select only relevant fields
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});


const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        // Basic image type check
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
});

router.put(
    '/profile-picture',
    auth,
    upload.single('profilePicture'), // 'profilePicture' must match the FormData key
    updateProfilePicture
);

router.put('/editName', updateName);
router.put('/editAddress', updateAddress);
router.post('/sending-request',campaignRequestSave);
router.delete('/deleteAddress',deleteAddress);
router.put('/editPhone', editPhone);

module.exports = router;
