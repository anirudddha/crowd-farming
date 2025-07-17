const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const auth = require('../middleware/userAuth');

// @route   POST api/payments/create-order
// @desc    Create a new Razorpay order for payment
// @access  Private
router.post('/create-order', auth, createOrder);

// @route   POST api/payments/verify-payment
// @desc    Verify the payment signature and finalize the investment
// @access  Private
router.post('/verify-payment', auth, verifyPayment);

module.exports = router;