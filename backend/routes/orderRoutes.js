const { Router } = require("express");
const UserOrders = require("../models/Orders");
const auth = require("../middleware/userAuth");

const orderRouter = new Router();
orderRouter.use(auth);

// POST /orders - Create a new order for a user or add an order to an existing user document
orderRouter.post('', async (req, res) => {
    try {
        // Expect req.body to include an `order` object with order details
        const { order } = req.body;
        // The auth middleware attaches the authenticated user to req.user
        const user = req.user ;

        if (!user || !order) {
            return res.status(400).json({ message: "User and order details are required." });
        }

        // Check if a document for this user already exists
        let userOrders = await UserOrders.findOne({ user });


        if (userOrders) {
            // Append new order to the existing orders array
            userOrders.orders.push(order);
        } else {
            // Create a new document for the user with the provided order
            userOrders = new UserOrders({
                user,
                orders: order
            });
        }
        // res.json(order);
        // console.log(userOrders);
        // res.json(userOrders);
        // Save the updated or new document. 
        // The orderEntrySchema will update the `updatedAt` field via its pre-save hook,
        // and the userOrdersSchema uses timestamps to manage createdAt and updatedAt.
        await userOrders.save();

        return res.status(201).json({ message: "Order saved successfully", data: userOrders });
    } catch (error) {
        console.error("Error saving order:", error);
        return res.status(500).json({ message: "Server error", error });
    }
});


// GET /orders/:userId - Retrieve all orders for a specific user
orderRouter.get('', async (req, res) => {
    try {
        const  userId  = req.user;

        const userOrders = await UserOrders.findOne({ user: userId });

        if (!userOrders) {
            // return res.json(userId);
            return res.status(404).json({ message: `No orders found for this user ${userId}` });
        }

        return res.status(200).json({ data: userOrders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "Server error", error });
    }
});

module.exports = { orderRouter }