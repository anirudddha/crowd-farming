const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in the environment variables');
  console.log(JWT_SECRET);
  process.exit(1); // Stop the server if the secret is not available
}

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body; // Ensure this matches the Signup component
  try {
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Server error' });
  }
});

// Login Route
// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    // Set Authorization header
    res.setHeader('Authorization', `Bearer ${token}`).json({ message: 'Logged in successfully!', token });

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Logout Route
router.post('/logout', (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out successfully!' });
});

module.exports = router;
