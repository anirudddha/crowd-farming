const { Router } = require("express");
const Orders = require("../models/Orders");
const { default: mongoose } = require("mongoose");

const orderRouter = new Router();

orderRouter.get("", async (req, res)=>{
    try{
        const {userId} = req.body;
        const response = await Orders.findOne({ userId });

        res.status(200).json({message:"Data retieved successfully", response});


    }catch(e){
        console.log(e);
        res.status(400).json({message: "Couldn't retrieve orders"});
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

module.exports = {orderRouter}