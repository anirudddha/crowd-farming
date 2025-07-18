const Razorpay = require('razorpay');
const crypto = require('crypto'); // <-- Make sure crypto is imported
const Campaign = require('../models/Campaign');
const Investment = require('../models/Investment');
const User = require('../models/User');
const UserOrders = require('../models/Orders'); // <-- IMPORTANT: Import your UserOrders model

// Initialize Razorpay instance (unchanged)
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * @desc    Create a Razorpay order
 * @route   POST /api/payments/create-order
 * @access  Private
 */
exports.createOrder = async (req, res) => {
    const { amount, campaignId } = req.body;
    const userId = req.user;

    try {
        const user = await User.findById(userId).select('name email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount < campaign.minInvestment) {
            return res.status(400).json({ message: `Investment amount must be at least ₹${campaign.minInvestment}` });
        }

        const options = {
            amount: numericAmount * 100,
            currency: "INR",
            
            // --- THIS IS THE FIX ---
            // We now generate a short, random, and unique receipt ID
            // that is well within the 40-character limit.
            receipt: `receipt_order_${crypto.randomBytes(8).toString('hex')}`,

            notes: {
                campaignId: campaignId.toString(),
                userId: userId.toString(),
                campaignTitle: campaign.campaignTitle,
            }
        };

        const order = await razorpayInstance.orders.create(options);
        if (!order) {
            return res.status(500).send("Error creating Razorpay order");
        }

        res.status(200).json({
            order,
            prefill: {
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// --- NEW FUNCTIONS FOR PRODUCT CHECKOUT ---

/**
 * @desc    Create a Razorpay order for a product purchase
 * @route   POST /api/payments/create-product-order
 * @access  Private
 */
exports.createProductOrder = async (req, res) => {
    const { amount } = req.body;
    const userId = req.user;

    try {
        const user = await User.findById(userId).select('name email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ message: 'Invalid order amount.' });
        }

        const options = {
            amount: Math.round(numericAmount * 100), // Ensure amount is an integer
            currency: "INR",
            receipt: `receipt_order_${crypto.randomBytes(8).toString('hex')}`,
            notes: {
                userId: userId.toString(),
                type: 'Product Purchase'
            }
        };

        const order = await razorpayInstance.orders.create(options);
        if (!order) {
            return res.status(500).send("Error creating Razorpay order for product");
        }

        res.status(200).json({
            order,
            prefill: {
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Error creating Razorpay product order:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


/**
 * @desc    Verify product payment and create the final order in the database
 * @route   POST /api/payments/verify-product-payment
 * @access  Private
 */
exports.verifyProductPayment = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderPayload // This will contain items, totalPrice, shippingAddress, etc.
    } = req.body;
    
    const userId = req.user;

    // 1. Verify Razorpay Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: "Payment verification failed." });
    }

    // 2. Signature is valid, now create the order using your existing logic
    try {
        const finalOrder = {
            ...orderPayload,
            paymentMethod: 'Razorpay',
            paymentStatus: 'Paid',
            paymentDetails: {
                provider: 'Razorpay',
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
            }
        };

        let userOrders = await UserOrders.findOne({ user: userId });

        if (userOrders) {
            userOrders.orders.push(finalOrder);
        } else {
            userOrders = new UserOrders({
                user: userId,
                orders: [finalOrder] // Ensure it's an array
            });
        }
        
        await userOrders.save();

        res.status(201).json({ 
            success: true, 
            message: "Order placed successfully!",
            data: userOrders
        });

    } catch (error) {
        console.error("Error saving final order after payment:", error);
        return res.status(500).json({ success: false, message: "Server error while saving order." });
    }
};

/**
 * @desc    Verify payment and update database
 * @route   POST /api/payments/verify-payment
 * @access  Private
 */
exports.verifyPayment = async (req, res) => {
    // This function does not need any changes.
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, campaignId, amount } = req.body;
    const userId = req.user;

    try {
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            const campaign = await Campaign.findById(campaignId);
            if (!campaign) {
                return res.status(404).json({ message: 'Campaign not found' });
            }

            await Campaign.findByIdAndUpdate(campaignId, {
                $inc: { raisedAmount: amount }
            });

            const newInvestment = new Investment({
                userId,
                campaignId,
                farmName: campaign.campaignTitle,
                amount,
                paymentDetails: {
                    provider: 'Razorpay',
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                }
            });
            await newInvestment.save();

            res.status(200).json({ 
                success: true, 
                message: "Investment successful!",
                investmentId: newInvestment._id 
            });

        } else {
            res.status(400).json({ success: false, message: "Payment verification failed." });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: "Server Error" });
    }
};