const { Router } = require("express");
const Orders = require("../models/Orders");
const { default: mongoose } = require("mongoose");
const auth = require("../middleware/userAuth");

const orderRouter = new Router();

orderRouter.get("", async (req, res) => {
    try {
        const { userId } = req.body;
        const response = await Orders.findOne({ userId });

        res.status(200).json({ message: "Data retieved successfully", response });


    } catch (e) {
        console.log(e);
        res.status(400).json({ message: "Couldn't retrieve orders" });
    }
})


//This endpoint will be used to post when needed 
// orderRouter.post("", async(req,res)=>{
//     try {
//         const newOrder = new Orders({
//           userId: new mongoose.Types.ObjectId("6713b7b97e1561297e85c253"), // Convert string to ObjectId
//           items: [
//             {
//               itemId: new mongoose.Types.ObjectId("65f1d6b97e1541297e85a123"), // Convert itemId to ObjectId
//               size: "250gm",
//               quantity: 2,
//               price: 50,
//               totalPrice: 100,
//             },
//             {
//               itemId: new mongoose.Types.ObjectId("65f1d6b97e1541297e85a456"), // Convert itemId to ObjectId
//               size: "500gm",
//               quantity: 1,
//               price: 90,
//               totalPrice: 90,
//             },
//           ],
//           paymentMethod: "Credit Card",
//           paymentStatus: "Paid",
//           shippingAddress: {
//             name: "Aniruddha",
//             phone: "+91-9876543210",
//             addressLine1: "At Pawarwadi, Post Nandgaon",
//             city: "Karad",
//             state: "Maharashtra",
//             zipCode: "415112",
//             country: "India",
//           },
//           orderStatus: "Processing",
//         });

//         const savedOrder = await newOrder.save();
//         console.log("Order inserted successfully:", savedOrder);
//       } catch (error) {
//         console.error("Error inserting order:", error);

//       }
// })


// POST /api/orders
orderRouter.post("", auth, async (req, res) => {
    try {
        // Assuming authentication middleware sets req.user to the user's ID

        // console.log(req.body);
        const userId = req.user;
        // console.log(req.user);
        const { items, paymentMethod, paymentStatus, shippingAddress, orderStatus } = req.body;

        // Validate required fields
        if (!userId || !items || !items.length || !paymentMethod || !shippingAddress) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Map each item to ensure itemId is converted to ObjectId
        const mappedItems = items.map(item => ({
            itemId: new mongoose.Types.ObjectId(item.itemId),
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            totalPrice: item.totalPrice,
        }));

        const newOrder = new Orders({
            userId: new mongoose.Types.ObjectId(userId),
            items: mappedItems,
            paymentMethod,
            paymentStatus: paymentStatus || "Pending",
            shippingAddress,
            orderStatus: orderStatus || "Processing",
        });

        console.log(newOrder);
        const savedOrder = await newOrder.save();
        console.log("Order inserted successfully:", savedOrder);
        res.status(201).json({ message: "Order inserted successfully", data: savedOrder });
    } catch (error) {
        console.error("Error inserting order:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

module.exports = { orderRouter }