const { Router } = require("express");
const Cart = require("../models/Cart");

const cartRouter = new Router();

cartRouter.get("", async(req, res) =>{
    try{
        const response = await Cart.find();
        res.status(200).json({message:"Data retrieved successfully", data: response});

    }catch(e){
        console.log(e);
        res.status(400).json({message:"Failed to retrieve data"});
    }

})


module.exports = {cartRouter};