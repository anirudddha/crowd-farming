const express = require('express');
// const { createUser } = require('../controllers/userController');
const User = require('../models/User');
const router = express.Router();
const Campaign = require('../models/Campaign'); // Assuming you have a Campaign model
const auth = require('../middleware/userAuth'); // Middleware to verify token
const Investment = require('../models/Investment'); // Import Investment model
const {
    updateName,
    updateAddress
} = require('../controllers/userController');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

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


// for profile picture 

// Set up storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user}_${Date.now()}${path.extname(file.originalname)}`); // unique filename
    },
});

// Multer middleware
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    },
});

// Route to upload profile picture
router.post('/upload-profile-picture', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const { profilePicture } = req.body;

        if (!profilePicture) {
            return res.status(400).json({ msg: 'No profile picture provided' });
        }

        // Optionally: Validate base64 string format
        const isBase64 = /^data:image\/[a-z]+;base64,/.test(profilePicture);
        if (!isBase64) {
            return res.status(400).json({ msg: 'Invalid image format. Ensure it is a base64 string.' });
        }

        // Save the new profile picture (base64 string) to the user's profile
        user.profilePicture = profilePicture;
        await user.save();

        res.json({
            msg: 'Profile picture uploaded successfully!',
            profilePicture: user.profilePicture, // Return the base64 string for immediate use
        });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Route to get the profile picture URL
// router.get('/profile-picture/:filename', (req, res) => {
//     const filepath = path.join(__dirname, '../uploads', req.params.filename);
//     if (fs.existsSync(filepath)) {
//         res.sendFile(filepath);
//     } else {
//         res.status(404).json({ msg: 'File not found' });
//     }
// });
router.put('/editName', updateName);
router.put('/editAddress', updateAddress);

module.exports = router;
