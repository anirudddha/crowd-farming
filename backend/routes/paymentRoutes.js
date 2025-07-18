const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, createProductOrder, verifyProductPayment } = require('../controllers/paymentController');
const auth = require('../middleware/userAuth');

// @route   POST api/payments/create-order
// @desc    Create a new Razorpay order for payment
// @access  Private
router.post('/create-order', auth, createOrder);

// @route   POST api/payments/verify-payment
// @desc    Verify the payment signature and finalize the investment
// @access  Private
router.post('/verify-payment', auth, verifyPayment);


// --- Product Order Routes (NEW) ---
router.post('/create-product-order', auth, createProductOrder);
router.post('/verify-product-payment', auth, verifyProductPayment);


module.exports = router;